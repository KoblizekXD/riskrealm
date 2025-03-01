"use client";

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
import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from './store';
import { useGameStore } from './store';


import { BetActions } from './components';
import { PlinkoGameBody } from './components';
import { MultiplierHistory } from './components';
import { config } from './config';
import { getMultiplierByLinesQnt } from './config';

type LinesType = 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16

type MultiplierValues =
  | 110
  | 88
  | 41
  | 33
  | 25
  | 18
  | 15
  | 10
  | 5
  | 3
  | 2
  | 1.5
  | 1
  | 0.5
  | 0.3

export function Plinko() {
  // #region States
  const incrementCurrentBalance = useAuthStore((state) => state.incrementBalance);
  const [lines, setLines] = useState<LinesType>(16);
  const inGameBallsCount = useGameStore((state) => state.gamesRunning);
  const incrementInGameBallsCount = useGameStore((state) => state.incrementGamesRunning);
  const decrementInGameBallsCount = useGameStore((state) => state.decrementGamesRunning);
  const [lastMultipliers, setLastMultipliers] = useState<number[]>([]);

  const {
    pins: pinsConfig,
    colors,
    ball: ballConfig,
    engine: engineConfig,
    world: worldConfig,
  } = config;

  const worldWidth = worldConfig.width;
  const worldHeight = worldConfig.height;

  const [engine] = useState(() => Engine.create()); // Create engine once
  const [render, setRender] = useState<Render | null>(null); // Store render instance
  // #endregion

  // Function to generate a random number within a range
  function random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  // Initialize the Matter.js engine and renderer
  useEffect(() => {
    // Clear existing renderer and world if they exist
    if (render) {
      Render.stop(render);
      render.canvas.remove();
      World.clear(engine.world, true);
    }

    // Set up new renderer
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

    setRender(newRender); // Store the new render instance
    Runner.run(Runner.create(), engine);
    Render.run(newRender);

    console.log('Matter.js Renderer initialized');

    // Cleanup function
    return () => {
      if (newRender) {
        Render.stop(newRender);
        newRender.canvas.remove();
        World.clear(engine.world, true);
      }
    };
  }, [lines, worldWidth, worldHeight]); // Reinitialize when lines or world size changes

  // Create pins
  useEffect(() => {
    // Clear existing pins
    const existingPins = Composite.allBodies(engine.world).filter((body) =>
      body.label.includes('pin')
    );
    Composite.remove(engine.world, existingPins);

    // Create new pins
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

    // Add new pins to the world
    Composite.add(engine.world, pins);
    console.log('Pins added to the world');
  }, [lines, worldWidth]); // Recreate pins when lines or world size changes

  // Add a ball to the game
  const addBall = useCallback(
    (ballValue: number) => {
      if (inGameBallsCount >= 15) {
        console.warn('Maximum number of balls reached (15)');
        return;
      }

      incrementInGameBallsCount();

      const minBallX = worldWidth / 2 - pinsConfig.pinSize * 3 + pinsConfig.pinGap;
      const maxBallX = worldWidth / 2 - pinsConfig.pinSize * 3 - pinsConfig.pinGap + pinsConfig.pinGap / 2;

      const ballX = random(minBallX, maxBallX);
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
      console.log(`Ball added at (${ballX}, 20)`);
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
  }, [lines, worldWidth]); // Recreate walls, floor, and multipliers when lines or world size changes

  // Handle bet action
  function bet(betValue: number) {
    console.log(`Bet placed with value: ${betValue}`);
    addBall(betValue);
  }

  // Handle collision with multiplier
  async function onCollideWithMultiplier(ball: Body, multiplier: Body) {
    ball.collisionFilter.group = 2;
    World.remove(engine.world, ball);
    decrementInGameBallsCount();

    const ballValue = ball.label.split('-')[1];
    const multiplierValue = +multiplier.label.split('-')[1] as MultiplierValues;

    setLastMultipliers((prev) => [multiplierValue, prev[0], prev[1], prev[2]]);

    if (+ballValue <= 0) return;

    const newBalance = +ballValue * multiplierValue;
    await incrementCurrentBalance(newBalance);
    console.log(`Ball collided with multiplier: ${multiplierValue}`);
  }

  // Handle body collisions
  async function onBodyCollision(event: IEventCollision<Engine>) {
    const pairs = event.pairs;
    for (const pair of pairs) {
      const { bodyA, bodyB } = pair;
      if (bodyB.label.includes('ball') && bodyA.label.includes('block')) {
        await onCollideWithMultiplier(bodyB, bodyA);
      }
    }
  }

  // Add collision event listener
  useEffect(() => {
    Events.on(engine, 'collisionActive', onBodyCollision);
    return () => {
      Events.off(engine, 'collisionActive', onBodyCollision);
    };
  }, []);

  return (
    <div className="flex h-fit flex-col-reverse items-center justify-center gap-4 md:flex-row">
      <BetActions
        inGameBallsCount={inGameBallsCount}
        onChangeLines={setLines}
        onRunBet={bet}
      />
      <MultiplierHistory multiplierHistory={lastMultipliers} />
      <div className="flex flex-1 items-center justify-center">
        <PlinkoGameBody />
      </div>
    </div>
  );
}