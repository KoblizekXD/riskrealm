"use client";

import DailyRewards from "@/components/daily-rewards";
import MyDialog from "@/components/dialog";
import Popover from "@/components/popover";
import Tooltip from "@/components/tooltip";
import { fire, startRussianRoulette, cashout } from "@/lib/games/russianroulette";
import type { User as UserType } from "@/lib/schemas";
import { canClaimStreak, updateBalance } from "@/lib/supabase/actions";
import { ExternalLink, Menu, Settings, User } from "lucide-react";
import { Orbitron } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";

export const orbitron = Orbitron({
  variable: "--font-luckiest-guy",
  subsets: ["latin"],
  weight: "variable",
});

export default function RussianRoulette({ user }: { user: UserType }) {
  const [streakClaimable, setStreakClaimable] = useState<boolean>(false);
  const [playerBalance, setPlayerBalance] = useState<number>(user.tickets);
  const [bet, setBet] = useState<number | null>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [bulletPosition, setBulletPosition] = useState<number>(0);
  const [currentChamber, setCurrentChamber] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [showResultPopup, setShowResultPopup] = useState<boolean>(false);
  const [oldBalance, setOldBalance] = useState<number>(0);

  // Načtení streak claim statusu
  useEffect(() => {
    canClaimStreak().then(setStreakClaimable);
  }, []);

  const handleStart = async () => {
    if (bet !== null) {
      if (bet <= 0 || bet > playerBalance) {
        alert("Invalid bet amount!");
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

      // Aktualizace zůstatku v databázi
      await updateBalance(gameState.playerBalance);
    }
  };

  const handleFire = async () => {
    if (bet !== null) {
      const gameState = await fire(currentChamber, bulletPosition, playerBalance, bet);
      setCurrentChamber(gameState.currentChamber);
      setGameOver(gameState.gameOver);
      setPlayerBalance(gameState.playerBalance);

      if (gameState.gameOver) {
        setResult(gameState.result);
        setShowResultPopup(true);

        // Aktualizace zůstatku v databázi
        await updateBalance(gameState.playerBalance);
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

      // Aktualizace zůstatku v databázi
      await updateBalance(cashoutResult.playerBalance);
    }
  };

  const handleReset = async () => {
    setPlayerBalance(oldBalance);
    setGameStarted(false);
    setGameOver(false);
    setResult("");
    setShowResultPopup(false);

    // Obnovení původního zůstatku v databázi
    await updateBalance(oldBalance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1124] to-[#110b18] text-[#D4AF37] flex flex-col overflow-hidden">
      <div className="flex flex-col items-center">
        <header className="h-20 bg-[#151520] shadow-lg border-b-2 border-[#18181B] items-center flex w-full justify-between px-2 md:px-6">
          <div className={"flex items-center space-x-2 md:space-x-4"}>
            <div className="text-2xl md:text-2xl font-bold text-[#d4af37]">
              Risk Realm
            </div>
          </div>
          <div className="flex items-center">
            {streakClaimable && <DailyRewards user={user} />}
            <div className="rounded gap-x-3 flex justify-center items-center bg-[#11111b] h-fit p-2">
              <span>{playerBalance} 🎫</span>
            </div>
          </div>
        </header>
        <main className="relative text-center flex-grow p-4 lg:p-4 flex flex-col items-center overflow-y-auto mr-auto ml-auto max-w-[1550px]">
          <div className="w-full max-w-6xl p-8">
            <h1 className="text-4xl font-bold mb-4 text-[#D4AF37] drop-shadow-[0_0_5px_#CFAF4A]">
              Russian Roulette
            </h1>
            <div className="mb-4 flex flex-col items-center justify-center gap-4">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <p className="text-xl text-[#FFD700]">
                  Balance: ${playerBalance}
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
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleStart}
                  disabled={gameStarted}
                  className="p-2 bg-[#D4AF37] text-white rounded hover:bg-[#FFD700] hover:text-black transition-colors cursor-pointer">
                  Start
                </button>
                <button
                  type="button"
                  onClick={handleFire}
                  disabled={!gameStarted || gameOver}
                  className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer">
                  Fire
                </button>
                <button
                  type="button"
                  onClick={handleCashout}
                  disabled={!gameStarted || gameOver}
                  className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer">
                  Cashout
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-8 mb-4">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-[#FFD700]">
                  Revolver Chamber: {currentChamber + 1}
                </h2>
                <div className="mt-4">
                  <img
                    src="/revolver.png"
                    alt="Revolver"
                    className="w-32 h-32"
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
                  className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer">
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