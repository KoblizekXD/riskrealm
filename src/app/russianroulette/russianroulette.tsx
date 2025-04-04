"use client";

import DailyRewards from "@/components/daily-rewards";
import MyDialog from "@/components/dialog";
import Navbar from "@/components/navbar";
import Popover from "@/components/popover";
import Tooltip from "@/components/tooltip";
import {
  cashout,
  fire,
  startRussianRoulette,
} from "@/lib/games/russianroulette";
import type { User as UserType } from "@/lib/schemas";
import {
  canClaimStreak,
  updateBalance,
  updateGems,
} from "@/lib/supabase/actions";
import { motion } from "framer-motion";
import {
  CandlestickChart,
  ChartCandlestick,
  ExternalLink,
  Menu,
  Settings,
  User,
} from "lucide-react";
import { Orbitron } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import CylinderImage from "../revolvercylinder.png";

export const orbitron = Orbitron({
  variable: "--font-luckiest-guy",
  subsets: ["latin"],
  weight: "variable",
});

export default function RussianRoulette({ user }: { user: UserType }) {
  const [streakClaimable, setStreakClaimable] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [playerBalance, setPlayerBalance] = useState<number>(user.tickets);
  const [oldBalance, setOldBalance] = useState<number>(0);
  const [bet, setBet] = useState<number | null>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [showBalanceError, setShowBalanceError] = useState<boolean>(false);
  const [showResultPopup, setShowResultPopup] = useState<boolean>(false);
  const [currentChamber, setCurrentChamber] = useState<number>(0);
  const [bulletPosition, setBulletPosition] = useState<number>(0);
  const [rotation, setRotation] = useState(0);
  const formatNumber = (num: number) => num.toLocaleString("en-US");

  useEffect(() => {
    canClaimStreak().then(setStreakClaimable);
  }, []);

  const handleClick = () => {
    setRotation(rotation + 60);
  };

  const handleStart = async () => {
    if (bet !== null) {
      if (bet <= 0 || bet > playerBalance) {
        setShowBalanceError(true);
        return;
      }
      const gameState = await startRussianRoulette(playerBalance, bet);
      setBulletPosition(gameState.bulletPosition);
      setCurrentChamber(0);
      setGameOver(false);
      setResult("");
      setPlayerBalance(gameState.playerBalance);
      setOldBalance(gameState.oldBalance);
      setGameStarted(true);
      setRotation(rotation + 360);
    }

    const playSpinSound = () => {
      const audio = new Audio("Sounds/chamberSpin.mp3");
      audio.play();
    };

    playSpinSound();
  };

  const handleFire = async () => {
    if (bet !== null) {
      const gameState = await fire(
        currentChamber,
        bulletPosition,
        playerBalance,
        bet
      );
      setCurrentChamber(gameState.currentChamber);
      setGameOver(gameState.gameOver);
      setPlayerBalance(gameState.playerBalance);
      setResult(gameState.result);
      setRotation(rotation + 60);

      if (gameState.gameOver) {
        setShowResultPopup(true);
        await updateBalance(gameState.playerBalance);

        const playFireSound = () => {
          const audio = new Audio("Sounds/fireSound.wav");
          audio.play();
        };

        playFireSound();
      } else {
        const playClickSound = () => {
          const audio = new Audio("Sounds/gunClick.mp3");
          audio.play();
        };

        playClickSound();
      }
    }
  };

  const handleCashout = async () => {
    if (bet !== null) {
      const cashoutResult = await cashout(currentChamber, playerBalance, bet);
      setPlayerBalance(cashoutResult.playerBalance);
      setResult(cashoutResult.result);
      setGameOver(true);
      setShowResultPopup(true);

      await updateBalance(cashoutResult.playerBalance);
    }
    if (Math.random() < 0.05) {
      updateGems(user.gems + 1);
    }
    const playWinSound = () => {
      const audio = new Audio("Sounds/winCash.wav");
      audio.play();
    };

    playWinSound();
  };

  const handleReset = () => {
    setGameStarted(false);
    setGameOver(false);
    setResult("");
    setShowResultPopup(false);
    setCurrentChamber(0);
    setBet(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1124] to-[#110b18] text-[#D4AF37] flex flex-col overflow-hidden">
      <Navbar isOpen={isNavOpen} toggleNav={() => setIsNavOpen(!isNavOpen)} />
      <div className="flex flex-col items-center">
        <header className="h-20 bg-[#151520] shadow-lg border-b-2 border-[#18181B] items-center flex w-full justify-between px-2 md:px-6">
          <div className={"flex items-center space-x-2 md:space-x-4"}>
            <button
              type="button"
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="text-4xl md:text-3xl font-bold text-[#d4af37] cursor-pointer hover:scale-110 transition-transform"
            >
              <Menu />
            </button>
            <Link
              href={"/"}
              className="text-2xl -translate-y-[1px] md:text-2xl font-bold text-[#d4af37]"
            >
              Risk Realm
            </Link>
          </div>

          <div className="flex items-center">
            <MyDialog
              title="Menu"
              className="w-[90vw]"
              trigger={
                <div className="cursor-pointer hover:scale-105 transition-transform p-1 border-gray-500 bg-black border rounded-md md:hidden z-40">
                  <Menu size={32} className="stroke-white" />
                </div>
              }
            >
              <div className="flex flex-col gap-y-2">
                <div className="rounded gap-x-3 flex justify-start items-center bg-[#11111b] h-fit p-2">
                  Balance:
                  <span>{formatNumber(user.tickets)} 🎫</span>
                  <span>{user.gems} 💎</span>
                </div>
                <p className="text-sm text-gray-300">
                  Signed in as {user.email}
                </p>
                <Link
                  className="font-semibold gap-x-2 flex items-center"
                  href={"/settings"}
                >
                  <Settings size={16} />
                  Options
                </Link>
                <Link
                  className="font-semibold brightness-50 gap-x-2 flex items-center"
                  href={"/trading"}
                >
                  <ChartCandlestick size={16} />
                  Trade gems
                </Link>
                <Link
                  className="font-semibold gap-x-2 flex items-center"
                  href={"/signout"}
                >
                  <ExternalLink size={16} />
                  Sign-out
                </Link>
              </div>
            </MyDialog>

            <div className="h-full gap-x-2 items-center hidden md:flex">
              {streakClaimable && (
                <DailyRewards
                  setCanClaim={setStreakClaimable}
                  setTickets={setPlayerBalance}
                  user={user}
                />
              )}
              <Tooltip
                content={
                  <div className="flex flex-col gap-y-2">
                    RiskRealm uses 2 types of currencies:
                    <span> - Tickets 🎫</span>
                    <span> - Gems 💎</span>
                  </div>
                }
              >
                <div className="rounded gap-x-3 flex justify-center items-center bg-[#11111b] h-fit p-2">
                  <span>{formatNumber(playerBalance)} 🎫</span>
                  <span>{user.gems} 💎</span>
                </div>
              </Tooltip>
              <Popover
                trigger={
                  <button
                    type="button"
                    className="font-semibold hover:bg-white/30 p-2 flex items-center gap-x-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <User size={28} color="#ce9aff" />
                    <span>{user.username}</span>
                  </button>
                }
              >
                <div className="rounded gap-y-2 flex flex-col bg-[#11111B] p-4">
                  <h2 className="font-semibold">My profile</h2>
                  <p className="text-sm text-gray-300">
                    Signed in as {user.email}
                  </p>
                  <Link
                    className="font-semibold gap-x-2 flex items-center"
                    href={"/settings"}
                  >
                    <Settings size={16} />
                    Options
                  </Link>
                  <Link
                    className="font-semibold gap-x-2 flex items-center"
                    href={"/trading"}
                  >
                    <CandlestickChart size={16} />
                    Trade gems
                  </Link>
                  <Link
                    className="font-semibold gap-x-2 flex items-center"
                    href={"/signout"}
                  >
                    <ExternalLink size={16} />
                    Sign-out
                  </Link>
                </div>
              </Popover>
            </div>
          </div>
        </header>
        <main
          className={`overflow-hidden relative text-center flex-grow p-4 lg:p-4 flex flex-col items-center mr-auto ml-auto max-w-[1550px] transition-all duration-300 ${
            isNavOpen ? "ml-64" : "ml-0"
          }`}
        >
          <div className="w-full max-w-6xl p-8">
            <h1 className="text-4xl font-bold mb-4 text-[#D4AF37] drop-shadow-[0_0_5px_#CFAF4A]">
              Russian Roulette
            </h1>
            <div className="mb-4 flex flex-col items-center justify-center gap-4">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <p className="text-xl text-[#FFD700]">
                  Balance: {formatNumber(playerBalance)}🎫
                </p>
                <input
                  type="number"
                  value={bet === null ? "" : bet}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setBet(null);
                    } else {
                      const parsedValue = Number.parseInt(value, 10);
                      if (!Number.isNaN(parsedValue)) {
                        setBet(parsedValue);
                      }
                    }
                  }}
                  placeholder="Place your bet"
                  className="p-2 rounded text-white bg-[#11111B] border border-[#D4AF37] focus:outline-none focus:ring focus:ring-[#D4AF37] focus:ring-opacity-50 transition-colors"
                  disabled={gameStarted}
                />
                <button
                  type="button"
                  onClick={() => setBet(playerBalance)}
                  disabled={gameStarted}
                  className="p-2 bg-[#6D28D9] text-white rounded hover:bg-[#7C3AED] transition-colors cursor-pointer w-1/8 mx-1"
                >
                  All In
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setBet(
                      playerBalance % 2 === 0
                        ? playerBalance / 2
                        : (playerBalance - 1) / 2
                    )
                  }
                  disabled={gameStarted}
                  className="p-2 bg-[#6D28D9] text-white rounded hover:bg-[#7C3AED] transition-colors cursor-pointer w-1/8 mx-1"
                >
                  ½
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setBet((prevBetValue) => (prevBetValue ?? 0) + 100)
                  }
                  disabled={gameStarted}
                  className="p-2 bg-[#6D28D9] text-white rounded hover:bg-[#7C3AED] transition-colors cursor-pointer w-1/8 mx-1"
                >
                  100
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setBet((prevBetValue) => (prevBetValue ?? 0) + 1000)
                  }
                  disabled={gameStarted}
                  className="p-2 bg-[#6D28D9] text-white rounded hover:bg-[#7C3AED] transition-colors cursor-pointer w-1/8 mx-1"
                >
                  1000
                </button>
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleStart}
                  disabled={gameStarted}
                  className="p-2 bg-[#D4AF37] text-white rounded hover:bg-[#FFD700] hover:text-black transition-colors cursor-pointer"
                >
                  Start
                </button>
                <button
                  type="button"
                  onClick={handleFire}
                  disabled={!gameStarted || gameOver}
                  className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Fire
                </button>
                <button
                  type="button"
                  onClick={handleCashout}
                  disabled={!gameStarted || gameOver}
                  className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
                >
                  Cashout
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-8 mb-4">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-[#FFD700]">
                  Revolver Chamber: {currentChamber}
                </h2>
                <div className="mt-4">
                  <motion.img
                    src={CylinderImage.src}
                    alt="Revolver"
                    className="overflow-hidden w-110 h-auto"
                    animate={{ rotate: rotation }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {showResultPopup && (
            <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center">
              <div className="bg-[#11111B]/90 p-6 rounded-lg shadow-lg backdrop-blur-[2px] border border-[#D4AF37]">
                <h2 className="text-2xl font-bold text-[#FFD700] mb-4">
                  {result}
                </h2>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
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
