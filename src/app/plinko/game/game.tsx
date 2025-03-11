"use client";

import {
  Bodies,
  type Body,
  Composite,
  Engine,
  Events,
  type IEventCollision,
  Render,
  Runner,
  World,
} from "matter-js";
import { type ChangeEvent, useCallback, useEffect, useState } from "react";

import DailyRewards from "@/components/daily-rewards";
import MyDialog from "@/components/dialog";
import Popover from "@/components/popover";
import Tooltip from "@/components/tooltip";
import type { User as UserType } from "@/lib/schemas";
import { canClaimStreak, updateBalance } from "@/lib/supabase/actions";
import { ExternalLink, Menu, Settings, User } from "lucide-react";
import { Orbitron } from "next/font/google";
import Link from "next/link";
import { MultiplierHistory, PlinkoGameBody } from "./components";
import { config, getMultiplierByLinesQnt, getMultiplierSound } from "./config";
import { useGameStore } from "./store";

export const orbitron = Orbitron({
  variable: "--font-luckiest-guy",
  subsets: ["latin"],
  weight: "variable",
});



type LinesType = 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
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
  | 0.3;

export function Plinko({ user }: { user: UserType }) {
  const [streakClaimable, setStreakClaimable] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [lines, setLines] = useState<LinesType>(16);
  const inGameBallsCount = useGameStore((state) => state.gamesRunning);
  const incrementInGameBallsCount = useGameStore(
    (state) => state.incrementGamesRunning,
  );
  const decrementInGameBallsCount = useGameStore(
    (state) => state.decrementGamesRunning,
  );
  const [lastMultipliers, setLastMultipliers] = useState<number[]>([]);
  const [playerBalance, setPlayerBalance] = useState<number>(user.tickets);
  const [betValue, setBetValue] = useState<number>(0);
  const ballEffect = "plinko/ball.wav";

  const {
    pins: pinsConfig,
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

  //Matter-js engine
  useEffect(() => {
    if (render) {
      Render.stop(render);
      render.canvas.remove();
      World.clear(engine.world, true);
    }

    const element = document.getElementById("plinko");
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
        background: "bg-gradient-to-b from-[#1a1124] to-[#110b18]",
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

  //Create pins
  useEffect(() => {
    const existingPins = Composite.allBodies(engine.world).filter((body) =>
      body.label.includes("pin"),
    );
    Composite.remove(engine.world, existingPins);

    const pins: Body[] = [];
    for (let l = 0; l < lines; l++) {
      const linePins = pinsConfig.startPins + l;
      const lineWidth = linePins * pinsConfig.pinGap;
      for (let i = 0; i < linePins; i++) {
        const pinX =
          worldWidth / 2 -
          lineWidth / 2 +
          i * pinsConfig.pinGap +
          pinsConfig.pinGap / 2;
        const pinY =
          worldWidth / lines + l * pinsConfig.pinGap + pinsConfig.pinGap;

        const pin = Bodies.circle(pinX, pinY, pinsConfig.pinSize, {
          label: `pin-${i}`,
          render: { fillStyle: "#F5DCFF" },
          isStatic: true,
        });
        pins.push(pin);
      }
    }

    Composite.add(engine.world, pins);
  }, [lines, worldWidth]);

  // Add a ball
  const addBall = useCallback(
    async (ballValue: number) => {
      if (inGameBallsCount >= 15) {
        return;
      }
      incrementInGameBallsCount();
      const ballSound = new Audio(ballEffect)
      ballSound.volume = 1
      ballSound.currentTime = 0
      ballSound.play()

      const minBallX =
        worldWidth / 2 - pinsConfig.pinSize * 3 + pinsConfig.pinGap;
      const maxBallX =
        worldWidth / 2 -
        pinsConfig.pinSize * 3 -
        pinsConfig.pinGap +
        pinsConfig.pinGap / 2;

      const ballX = Math.random() * (maxBallX - minBallX) + minBallX;
      const ballColor = ballValue <= 0 ? "white" : "[#D4AF37]";

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
    [lines, inGameBallsCount, worldWidth],
  );

  // Create walls, floor, and multipliers
  useEffect(() => {
    // Clear existing walls, floor, and multipliers
    const existingWalls = Composite.allBodies(engine.world).filter(
      (body) => body.label.includes("wall") || body.label.includes("block"),
    );
    Composite.remove(engine.world, existingWalls);

    // Create new walls and floor
    const leftWall = Bodies.rectangle(
      worldWidth / 3 -
        pinsConfig.pinSize * pinsConfig.pinGap -
        pinsConfig.pinGap,
      worldWidth / 2 - pinsConfig.pinSize,
      worldWidth * 2,
      40,
      {
        angle: 90,
        render: { visible: false },
        isStatic: true,
        label: "wall-left",
      },
    );

    const rightWall = Bodies.rectangle(
      worldWidth -
        pinsConfig.pinSize * pinsConfig.pinGap -
        pinsConfig.pinGap -
        pinsConfig.pinGap / 2,
      worldWidth / 2 - pinsConfig.pinSize,
      worldWidth * 2,
      40,
      {
        angle: -90,
        render: { visible: false },
        isStatic: true,
        label: "wall-right",
      },
    );

    const floor = Bodies.rectangle(0, worldWidth + 10, worldWidth * 10, 40, {
      label: "block-1",
      render: { visible: false },
      isStatic: true,
    });

    // Create new multipliers
    const multipliers = getMultiplierByLinesQnt(lines);
    const multipliersBodies: Body[] = [];

    let lastMultiplierX =
      worldWidth / 2 - (pinsConfig.pinGap / 2) * lines - pinsConfig.pinGap;

    multipliers.forEach((multiplier) => {
      const blockSize = 20;
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
        },
      );

      lastMultiplierX = multiplierBody.position.x;
      multipliersBodies.push(multiplierBody);
    });

    // Add new walls, floor, and multipliers to the world
    Composite.add(engine.world, [
      ...multipliersBodies,
      leftWall,
      rightWall,
      floor,
    ]);
  }, [lines, worldWidth]);

  const handleRunBet = async () => {
    if (inGameBallsCount >= 15) return;
    if (betValue > playerBalance) {
      setBetValue(playerBalance);
      return;
    }

    addBall(betValue);
    if (betValue <= 0) return;
    console.log("x");
    setPlayerBalance((prevBalance) => {
      prevBalance = prevBalance - betValue;
      return prevBalance;
    });
  };

  useEffect(() => {
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

      const ballValue = ball.label.split("-")[1];
      const multiplierValue = +multiplier.label.split(
        "-",
      )[1] as MultiplierValues;

      const multiplierSound = new Audio(getMultiplierSound(multiplierValue))
    multiplierSound.currentTime = 0
    multiplierSound.volume = 1
    multiplierSound.play()

      setLastMultipliers((prev) => [
        multiplierValue,
        prev[0],
        prev[1],
        prev[2],
      ]);

      if (+ballValue <= 0) return;

      const newWin = multiplierValue * +ballValue;
      setPlayerBalance((prevBalance) => {
        prevBalance = prevBalance + Math.round(newWin);
        return prevBalance;
      });
    },
    [lines],
  );

  // Handle body collisions
  const onBodyCollision = useCallback(
    async (event: IEventCollision<Engine>) => {
      const pairs = event.pairs;
      for (const pair of pairs) {
        const { bodyA, bodyB } = pair;
        if (bodyB.label.includes("ball") && bodyA.label.includes("block")) {
          await onCollideWithMultiplier(bodyB, bodyA);
        }
      }
    },
    [onCollideWithMultiplier],
  );

  // Add collision event listener
  useEffect(() => {
    Events.on(engine, "collisionActive", onBodyCollision);
    return () => {
      Events.off(engine, "collisionActive", onBodyCollision);
    };
  }, [onBodyCollision]);

  function Navbar({ isOpen }: { isOpen: boolean }) {
    return (
      <div
        className={`fixed left-0 top-0 h-screen bg-[#151520] shadow-lg border-r-2 border-[#18181B] transition-all duration-300 z-50 ${
          isOpen ? "w-64" : "hidden"
        }`}>
        <div className="p-4">
          <div className="flex items-center space-x-2 md:space-x-4 justify-between">
            <h2 className="text-2xl font-bold text-[#d4af37] border-b-2 border-[#d4af37]">
              Risk Realm
            </h2>
            <button
              type="button"
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="text-4xl md:text-3xl font-bold text-[#d4af37] cursor-pointer hover:scale-110 transition-transform">
              X
            </button>
          </div>
        </div>

        <ul className="p-4">
          <li className="mb-2">
            <Link href="/" className="text-[#D4AF37] hover:text-[#FFD700]">
              Home
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/games" className="text-[#D4AF37] hover:text-[#FFD700]">
              Games
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/profile"
              className="text-[#D4AF37] hover:text-[#FFD700]">
              Profile
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/settings"
              className="text-[#D4AF37] hover:text-[#FFD700]">
              Settings
            </Link>
          </li>
        </ul>
      </div>
    );
  }

  useEffect(() => {
    canClaimStreak().then(setStreakClaimable);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1124] to-[#110b18] text-[#D4AF37] flex flex-col overflow-hidden">
      <Navbar isOpen={isNavOpen} />
      <div className="flex flex-col items-center">
        <header className="h-20 bg-[#151520] shadow-lg border-b-2 border-[#18181B] items-center flex w-full justify-between px-2 md:px-6">
          <div className={"flex items-center space-x-2 md:space-x-4"}>
            <button
              type="button"
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="text-4xl md:text-3xl font-bold text-[#d4af37] cursor-pointer hover:scale-110 transition-transform">
              ☰
            </button>
            <div className="text-2xl md:text-2xl font-bold text-[#d4af37]">
              Risk Realm
            </div>
          </div>

          <div className="flex items-center">
            <MyDialog
              title="Menu"
              className="w-[90vw]"
              trigger={
                <div className="cursor-pointer hover:scale-105 transition-transform p-1 border-gray-500 bg-black border rounded-md md:hidden z-40">
                  <Menu size={32} className="stroke-white" />
                </div>
              }>
              <div className="flex flex-col gap-y-2">
                <div className="rounded gap-x-3 flex justify-start items-center bg-[#11111b] h-fit p-2">
                  Balance:
                  <span>{user.tickets} 🎫</span>
                  <span>{user.gems} 💎</span>
                </div>
                <p className="text-sm text-gray-300">
                  Signed in as {user.email}
                </p>
                <Link
                  className="font-semibold gap-x-2 flex items-center"
                  href={"/settings"}>
                  <Settings size={16} />
                  Options
                </Link>
                <Link
                  className="font-semibold gap-x-2 flex items-center"
                  href={"/signout"}>
                  <ExternalLink size={16} />
                  Sign-out
                </Link>
              </div>
            </MyDialog>

            <div className="h-full gap-x-2 items-center hidden md:flex">
              {streakClaimable && <DailyRewards user={user} />}
              <Tooltip
                content={
                  <div className="flex flex-col gap-y-2">
                    RiskRealm uses 2 types of currencies:
                    <span> - Tickets 🎫</span>
                    <span> - Gems 💎</span>
                  </div>
                }>
                <div className="rounded gap-x-3 flex justify-center items-center bg-[#11111b] h-fit p-2">
                  <span>{playerBalance} 🎫</span>
                  <span>{user.gems} 💎</span>
                </div>
              </Tooltip>
              <Popover
                trigger={
                  <button
                    type="button"
                    className="font-semibold hover:bg-white/30 p-2 flex items-center gap-x-2 rounded-lg transition-colors cursor-pointer">
                    <User size={28} color="#ce9aff" />
                    <span>{user.username}</span>
                  </button>
                }>
                <div className="rounded gap-y-2 flex flex-col bg-[#11111B] p-4">
                  <h2 className="font-semibold">My profile</h2>
                  <p className="text-sm text-gray-300">
                    Signed in as {user.email}
                  </p>
                  <Link
                    className="font-semibold gap-x-2 flex items-center"
                    href={"/settings"}>
                    <Settings size={16} />
                    Options
                  </Link>
                  <Link
                    className="font-semibold gap-x-2 flex items-center"
                    href={"/signout"}>
                    <ExternalLink size={16} />
                    Sign-out
                  </Link>
                </div>
              </Popover>
            </div>
          </div>
        </header>
        <main
          className={`relative text-center flex-grow p-0 md:p-0 lg:p-8 flex flex-col items-center overflow-y-auto my-auto mx-auto max-w-[1550px] lg:min-w-[1000px] transition-all duration-300 `}>
          <div className="flex w-full h-fit flex-col items-center justify-between md:flex-row p-8">
            {/*Bet oanel  */}
            <div className="relative w-sm flex flex-col py-8 px-6 rounded-lg border border-[#D4AF37] bg-[#1E1E1E] shadow-lg">
              <div className="flex flex-col gap-2 mb-6">
                <span className="text-sm font-bold text-[#D4AF37] md:text-lg">
                  Balls: {inGameBallsCount.toFixed(0)}/15
                </span>
                <span className="text-sm font-bold text-[#D4AF37] md:text-lg">
                  Balance: {playerBalance}
                </span>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <span className="text-lg font-bold text-[#D4AF37]">
                    Place a Bet
                  </span>

                  <input
                    type="number"
                    min={0}
                    max={playerBalance}
                    onChange={handleChangeBetValue}
                    value={betValue}
                    className="w-full rounded-md border-2 border-[#D4AF37] bg-transparent p-4 font-bold text-[#D4AF37] focus:outline-none"
                    placeholder="Enter bet amount"
                  />

                  <div className="flex items-stretch gap-2">
                    <button
                      onClick={handleHalfBet}
                      className="flex-1 rounded-md bg-[#1E1E1E] p-3 border border-[#D4AF37] cursor-pointer hover:bg-[#C0A236] transition-colors text-[#D4AF37] hover:text-[#1E1E1E] font-bold">
                      ½
                    </button>
                    <button
                      onClick={handleDoubleBet}
                      className="flex-1 rounded-md bg-[#1E1E1E] p-3 border border-[#D4AF37] cursor-pointer hover:bg-[#C0A236] transition-colors text-[#D4AF37] hover:text-[#1E1E1E] font-bold">
                      2x
                    </button>
                    <button
                      onClick={handleMaxBet}
                      className="flex-1 rounded-md bg-[#1E1E1E] p-3 border border-[#D4AF37] cursor-pointer hover:bg-[#C0A236] transition-colors text-[#D4AF37] hover:text-[#1E1E1E] font-bold">
                      Max
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleRunBet}
                  className="w-full rounded-md bg-[#1E1E1E] px-6 py-4 font-bold text-[#D4AF37] hover:bg-[#C0A236] hover:text-[#1E1E1E] focus:outline-none border  border-[#D4AF37]">
                  Bet
                </button>
              </div>
            </div>

            <MultiplierHistory multiplierHistory={lastMultipliers} />

            <div className="flex flex-1 items-center justify-center">
              <PlinkoGameBody />
            </div>
          </div>
        </main>
      </div>

      <footer className="h-16 flex mt-auto items-center justify-center border-t border-gray-800 bg-[#181825]">
        <p className="text-[#D4AF37] text-xs md:text-sm">
          © 2025 Risk Realm. All Rights Reserved. Gamble until zero.
        </p>
      </footer>
    </div>
  );
}
