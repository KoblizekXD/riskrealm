"use client";

import { useCallback, useEffect, useState, ChangeEvent } from 'react';
import {
  Bodies,
  Body,
  Composite,
  Engine,
  Events,
  IEventCollision,
  Render,
  Runner,
  World,
} from 'matter-js';

import { useGameStore } from './store';
import { PlinkoGameBody, MultiplierHistory } from './components';
import { config, getMultiplierByLinesQnt } from './config';
import { incrementBalance, decrementBalance, calcWin, canAddBall } from '../../../lib/games/plinko';
import { canClaimStreak, updateBalance } from "@/lib/supabase/actions";
import DailyRewards from "@/components/daily-rewards";
import MyDialog from "@/components/dialog";
import Popover from "@/components/popover";
import Tooltip from "@/components/tooltip";
import { hit, stand, startGame } from "@/lib/games/blackjack";
import type { User as UserType } from "@/lib/schemas";



type LinesType = 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
type MultiplierValues = 110 | 88 | 41 | 33 | 25 | 18 | 15 | 10 | 5 | 3 | 2 | 1.5 | 1 | 0.5 | 0.3;

export function Plinko({ user }: { user: UserType }) {
  // #region States
  const [lines, setLines] = useState<LinesType>(16);
  const inGameBallsCount = useGameStore((state) => state.gamesRunning);
  const incrementInGameBallsCount = useGameStore((state) => state.incrementGamesRunning);
  const decrementInGameBallsCount = useGameStore((state) => state.decrementGamesRunning);
  const [lastMultipliers, setLastMultipliers] = useState<number[]>([]);
  const [playerBalance, setPlayerBalance] = useState<number>(user.tickets);
  const [betValue, setBetValue] = useState<number>(0);

  const {
    pins: pinsConfig,
    colors,
    ball: ballConfig,
    engine: engineConfig,
    world: worldConfig,
  } = config;

  const worldWidth = worldConfig.width;
  const worldHeight = worldConfig.height;

  const [engine] = useState(() => Engine.create());
  const [render, setRender] = useState<Render | null>(null);

  const maxLinesQnt = 16;
  const linesOptions: number[] = [];
  for (let i = 8; i <= maxLinesQnt; i++) {
    linesOptions.push(i);
  }
  // #endregion

  // Initialize the Matter.js engine and renderer
  useEffect(() => {
    if (render) {
      Render.stop(render);
      render.canvas.remove();
      World.clear(engine.world, true);
    }

    const element = document.getElementById('plinko');
    if (!element) {
      console.error("Element with ID 'plinko' not found!");
      return;
    }

    const newRender = Render.create({
      element,
      engine,
      options: {
        width: worldWidth,
        height: worldHeight,
        background: colors.background,
        wireframes: false,
        hasBounds: true,
      },
    });

    setRender(newRender);
    Runner.run(Runner.create(), engine);
    Render.run(newRender);

    return () => {
      if (newRender) {
        Render.stop(newRender);
        newRender.canvas.remove();
        World.clear(engine.world, true);
      }
    };
  }, [lines, worldWidth, worldHeight]);

  // Create pins
  useEffect(() => {
    const existingPins = Composite.allBodies(engine.world).filter((body) =>
      body.label.includes('pin')
    );
    Composite.remove(engine.world, existingPins);

    const pins: Body[] = [];
    for (let l = 0; l < lines; l++) {
      const linePins = pinsConfig.startPins + l;
      const lineWidth = linePins * pinsConfig.pinGap;
      for (let i = 0; i < linePins; i++) {
        const pinX = worldWidth / 2 - lineWidth / 2 + i * pinsConfig.pinGap + pinsConfig.pinGap / 2;
        const pinY = worldWidth / lines + l * pinsConfig.pinGap + pinsConfig.pinGap;

        const pin = Bodies.circle(pinX, pinY, pinsConfig.pinSize, {
          label: `pin-${i}`,
          render: { fillStyle: '#F5DCFF' },
          isStatic: true,
        });
        pins.push(pin);
      }
    }

    Composite.add(engine.world, pins);
  }, [lines, worldWidth]);

  // Add a ball to the game
  const addBall = useCallback(
    async (ballValue: number) => {
      const canAdd = await canAddBall(inGameBallsCount);
      if (!canAdd) {
        console.warn('Maximum number of balls reached (15)');
        return;
      }
      setPlayerBalance(playerBalance - ballValue);
      incrementInGameBallsCount();

      const minBallX = worldWidth / 2 - pinsConfig.pinSize * 3 + pinsConfig.pinGap;
      const maxBallX = worldWidth / 2 - pinsConfig.pinSize * 3 - pinsConfig.pinGap + pinsConfig.pinGap / 2;

      const ballX = Math.random() * (maxBallX - minBallX) + minBallX;
      const ballColor = ballValue <= 0 ? colors.text : colors.purple;

      const ball = Bodies.circle(ballX, 20, ballConfig.ballSize, {
        restitution: 1,
        friction: 0.6,
        label: `ball-${ballValue}`,
        id: new Date().getTime(),
        frictionAir: 0.05,
        collisionFilter: { group: -1 },
        render: { fillStyle: ballColor },
        isStatic: false,
      });

      Composite.add(engine.world, ball);
    },
    [lines, inGameBallsCount, worldWidth]
  );

  // Create walls, floor, and multipliers
  useEffect(() => {
    // Clear existing walls, floor, and multipliers
    const existingWalls = Composite.allBodies(engine.world).filter((body) =>
      body.label.includes('wall') || body.label.includes('block')
    );
    Composite.remove(engine.world, existingWalls);

    // Create new walls and floor
    const leftWall = Bodies.rectangle(
      worldWidth / 3 - pinsConfig.pinSize * pinsConfig.pinGap - pinsConfig.pinGap,
      worldWidth / 2 - pinsConfig.pinSize,
      worldWidth * 2,
      40,
      {
        angle: 90,
        render: { visible: false },
        isStatic: true,
        label: 'wall-left',
      }
    );

    const rightWall = Bodies.rectangle(
      worldWidth - pinsConfig.pinSize * pinsConfig.pinGap - pinsConfig.pinGap - pinsConfig.pinGap / 2,
      worldWidth / 2 - pinsConfig.pinSize,
      worldWidth * 2,
      40,
      {
        angle: -90,
        render: { visible: false },
        isStatic: true,
        label: 'wall-right',
      }
    );

    const floor = Bodies.rectangle(0, worldWidth + 10, worldWidth * 10, 40, {
      label: 'block-1',
      render: { visible: false },
      isStatic: true,
    });

    // Create new multipliers
    const multipliers = getMultiplierByLinesQnt(lines);
    const multipliersBodies: Body[] = [];

    let lastMultiplierX = worldWidth / 2 - (pinsConfig.pinGap / 2) * lines - pinsConfig.pinGap;

    multipliers.forEach((multiplier) => {
      const blockSize = 20; // height and width
      const multiplierBody = Bodies.rectangle(
        lastMultiplierX + 20,
        worldWidth / lines + lines * pinsConfig.pinGap + pinsConfig.pinGap,
        blockSize,
        blockSize,
        {
          label: multiplier.label,
          isStatic: true,
          render: {
            sprite: {
              xScale: 1,
              yScale: 1,
              texture: multiplier.img,
            },
          },
        }
      );

      lastMultiplierX = multiplierBody.position.x;
      multipliersBodies.push(multiplierBody);
    });

    // Add new walls, floor, and multipliers to the world
    Composite.add(engine.world, [...multipliersBodies, leftWall, rightWall, floor]);
    console.log('Walls, floor, and multipliers added to the world');
  }, [lines, worldWidth]);

  // Handle bet action
  const handleRunBet = async () => {
    if (inGameBallsCount >= 15) return;
    if (betValue > playerBalance) {
      setBetValue(playerBalance);
      return;
    }
    addBall(betValue);
    if (betValue <= 0) return;
    setPlayerBalance((prevBalance) => {
      prevBalance = prevBalance - betValue
      return prevBalance;
    })

  };

  useEffect(() => {
    console.log("balance updated ->", playerBalance);
    updateBalance(playerBalance);
  }, [playerBalance]);

  const handleChangeBetValue = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = +e.target.value;
    const newBetValue = value >= playerBalance ? playerBalance : value;
    setBetValue(newBetValue);
  };

  const handleChangeLines = (e: ChangeEvent<HTMLSelectElement>) => {
    setLines(Number(e.target.value) as LinesType);
  };

  const handleHalfBet = () => {
    const value = betValue / 2;
    const newBetvalue = value <= 0 ? 0 : Math.floor(value);
    setBetValue(newBetvalue);
  };

  const handleDoubleBet = () => {
    const value = betValue * 2;
    if (value >= playerBalance) {
      setBetValue(playerBalance);
      return;
    }
    const newBetvalue = value <= 0 ? 0 : Math.floor(value);
    setBetValue(newBetvalue);
  };

  const handleMaxBet = () => {
    setBetValue(playerBalance);
  };

  // Handle collision with multiplier
  const onCollideWithMultiplier = useCallback(
    async (ball: Body, multiplier: Body) => {
      ball.collisionFilter.group = 2;
      World.remove(engine.world, ball);
      decrementInGameBallsCount();

      const ballValue = ball.label.split('-')[1];
      const multiplierValue = +multiplier.label.split('-')[1] as MultiplierValues;

      setLastMultipliers((prev) => [multiplierValue, prev[0], prev[1], prev[2]]);

      if (+ballValue <= 0) return;

      const newWin = multiplierValue * +ballValue;
      setPlayerBalance((prevBalance) => {
        prevBalance = prevBalance + newWin
        return prevBalance;
      })
    },
    [lines]
  );

  // Handle body collisions
  const onBodyCollision = useCallback(
    async (event: IEventCollision<Engine>) => {
      const pairs = event.pairs;
      for (const pair of pairs) {
        const { bodyA, bodyB } = pair;
        if (bodyB.label.includes('ball') && bodyA.label.includes('block')) {
          await onCollideWithMultiplier(bodyB, bodyA);
        }
      }
    },
    [onCollideWithMultiplier]
  );

  // Add collision event listener
  useEffect(() => {
    Events.on(engine, 'collisionActive', onBodyCollision);
    return () => {
      Events.off(engine, 'collisionActive', onBodyCollision);
    };
  }, [onBodyCollision]);

  return (
    <div className="flex h-fit flex-col-reverse items-center justify-center gap-4 md:flex-row">

      

      {/* Bet Actions UI */}
      <div className="relative h-1/2 w-full flex-1 py-8 px-4 bg-cyan-500">
        <span className="absolute left-4 top-0 mx-auto text-xs font-bold text-black md:text-base">
          balls: {inGameBallsCount.toFixed(0)}/15
        </span>
        <br></br>
        <span className="left-4 top-0 mx-auto text-xs font-bold text-black md:text-base">
          Balance: {playerBalance}
        </span>

        <div className="flex h-full flex-col gap-4 rounded-md bg-primary p-4 text-text md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-stretch gap-1 md:flex-col">
              <div className="w-full text-sm font-bold md:text-base">
                <div className="flex flex-1 items-stretch justify-between">
                  <span>Place a Bet</span>
                  <div className="flex items-center gap-1">
                    <div className="rounded-full bg-purpleDark p-0.5">

                    </div>
                    <span>{betValue.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-stretch justify-center shadow-md">
                  <input
                    type="number"
                    min={0}
                    max={playerBalance}
                    onChange={handleChangeBetValue}
                    value={betValue}
                    className="w-full rounded-bl-md rounded-tl-md border-2 border-secondary bg-background p-2.5 px-4 font-bold transition-colors placeholder:font-bold placeholder:text-text focus:border-purple focus:outline-none md:p-2"
                  />
                  <button
                    onClick={handleHalfBet}
                    className="relative border-2 border-transparent bg-secondary p-2.5 px-3 transition-colors after:absolute after:top-[calc(50%_-_8px)] after:right-0 after:h-4 after:w-0.5 after:rounded-lg after:bg-background after:content-[''] hover:bg-secondary/80 focus:border-purple focus:outline-none md:p-2"
                  >
                    ½
                  </button>
                  <button
                    onClick={handleDoubleBet}
                    className="relative border-2 border-transparent bg-secondary p-2.5 px-3 transition-colors after:absolute after:top-[calc(50%_-_8px)] after:right-0 after:h-4 after:w-0.5 after:rounded-lg after:bg-background after:content-[''] hover:bg-secondary/80 focus:border-purple focus:outline-none md:p-2"
                  >
                    2x
                  </button>
                  <button
                    onClick={handleMaxBet}
                    className="rounded-br-md rounded-tr-md border-2 border-transparent bg-secondary p-2 px-3 text-xs transition-colors hover:bg-secondary/80 focus:border-purple focus:outline-none"
                  >
                    max
                  </button>
                </div>
              </div>
            </div>
            <select
              disabled={inGameBallsCount > 0}
              onChange={handleChangeLines}
              defaultValue={16}
              className="w-full rounded-md border-2 border-secondary bg-background py-2 px-4 font-bold transition-all placeholder:font-bold placeholder:text-text focus:border-purple focus:outline-none disabled:line-through disabled:opacity-80"
              id="lines"
            >
              {linesOptions.map((line) => (
                <option key={line} value={line}>
                  {line} Lines
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleRunBet}
            className="hidden rounded-md bg-purple px-6 py-5 font-bold leading-none text-background transition-colors hover:bg-purpleDark focus:outline-none focus:ring-1 focus:ring-purple focus:ring-offset-1 focus:ring-offset-primary disabled:bg-gray-500 md:visible md:block"
          >
            Bet
          </button>
        </div>
      </div>
      <MultiplierHistory multiplierHistory={lastMultipliers} />
      <div className="flex flex-1 items-center justify-center">
        <PlinkoGameBody />
      </div>
    </div>
  );
}