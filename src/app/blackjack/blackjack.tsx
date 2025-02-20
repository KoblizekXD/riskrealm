'use client';

import { useEffect, useState } from 'react';
import { startGame, hit, stand, getGameState } from "@/lib/games/blackjack";
import Card from './card';
import DailyRewards from "@/components/daily-rewards";
import MyDialog from "@/components/dialog";
import Popover from "@/components/popover";
import Tooltip from "@/components/tooltip";
import type { User as UserType } from "@/lib/schemas";
import { canClaimStreak } from "@/lib/supabase/actions";
import { ExternalLink, Menu, Settings, User } from "lucide-react";
import { Orbitron } from "next/font/google";
import Link from "next/link";
import { set } from 'zod';

export const orbitron = Orbitron({
  variable: "--font-luckiest-guy",
  subsets: ["latin"],
  weight: "variable",
});

export default function BlackJack({ user }: { user: UserType }) {
  const [streakClaimable, setStreakClaimable] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const [playerHand, setPlayerHand] = useState<string[]>([]);
  const [dealerHand, setDealerHand] = useState<string[]>([]);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [dealerScore, setDealerScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [playerBalance, setPlayerBalance] = useState<number>(1000);
  const [bet, setBet] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [showBalanceError, setShowBalanceError] = useState<boolean>(false);

  useEffect(() => {
    const fetchGameState = async () => {
      const gameState = await getGameState();
      setPlayerBalance(gameState.playerBalance);
    };
    fetchGameState();
  }, []);

  const handleStart = async () => {
    if (bet <= 0 || bet > playerBalance) {
      setShowBalanceError(true);
      return;
    }
    const gameState = await startGame(bet);
    setPlayerHand(gameState.playerHand);
    setDealerHand(gameState.dealerHand);
    setPlayerScore(gameState.playerScore);
    setDealerScore(gameState.dealerScore);
    setGameOver(gameState.gameOver);
    setResult("");
    setPlayerBalance(gameState.playerBalance);
    setGameStarted(true);
  };

  const handleHit = async () => {
    const gameState = await hit(playerHand, bet);
    setPlayerHand(gameState.playerHand);
    setPlayerScore(gameState.playerScore);
    setGameOver(gameState.gameOver);
    if (gameState.gameOver) {
      setResult("Player busts! Dealer wins!");
    }
  };

  const handleStand = async () => {
    const gameState = await stand(dealerHand, playerScore, bet);
    setDealerHand(gameState.dealerHand);
    setDealerScore(gameState.dealerScore);
    setGameOver(gameState.gameOver);
    setResult(gameState.result);
    setPlayerBalance(gameState.playerBalance);
  };

  const handleReset = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setPlayerScore(0);
    setDealerScore(0);
    setGameOver(false);
    setResult("");
    setBet(0);
    setGameStarted(false);
  };

  function Navbar({ isOpen }: { isOpen: boolean }) {
    return (
      <div
        className={`fixed left-0 top-0 h-screen bg-[#151520] shadow-lg border-r-2 border-[#18181B] transition-all duration-300 z-50 ${
          isOpen ? "w-64" : "hidden"
        }`}
      >
        <div className="p-4">
          <div className="flex items-center space-x-2 md:space-x-4 justify-between">
            <h2 className="text-2xl font-bold text-[#d4af37] border-b-2 border-[#d4af37]">Risk Realm</h2>
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="text-4xl md:text-3xl font-bold text-[#d4af37] cursor-pointer hover:scale-110 transition-transform"
            >
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
            <Link href="/profile" className="text-[#D4AF37] hover:text-[#FFD700]">
              Profile
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/settings" className="text-[#D4AF37] hover:text-[#FFD700]">
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
          <div className={`flex items-center space-x-2 md:space-x-4`}>
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="text-4xl md:text-3xl font-bold text-[#d4af37] cursor-pointer hover:scale-110 transition-transform"
            >
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
              }
            >
              <div className="flex flex-col gap-y-2">
                <div className="rounded gap-x-3 flex justify-start items-center bg-[#11111b] h-fit p-2">
                  Balance:
                  <span>{user.tickets} 🎫</span>
                  <span>{user.gems} 💎</span>
                </div>
                <p className="text-sm text-gray-300">Signed in as {user.email}</p>
                <Link
                  className="font-semibold gap-x-2 flex items-center"
                  href={"/settings"}
                >
                  <Settings size={16} />
                  Options
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
              {streakClaimable && <DailyRewards user={user} />}
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
                  <span>{user.tickets} 🎫</span>
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
          className={`relative text-center flex-grow p-4 lg:p-8 flex flex-col items-center overflow-y-auto mr-auto ml-auto max-w-[1550px] transition-all duration-300 ${
            isNavOpen ? "ml-64" : "ml-0"
          }`}
        >
          <div className="w-full max-w-4xl bg-green-900 p-8 rounded-lg shadow-lg border-2 border-green-800">
            <h1 className="text-4xl font-bold mb-4 text-[#FFD700]">Blackjack</h1>
            <div className="mb-4">
              <input
  type="number"
  value={bet === null ? "" : bet} // Show blank if bet is null
  onChange={(e) => {
    const value = e.target.value;
    // If the input is blank, set bet to null
    if (value === "") {
      setBet(null);
    } else {
      // Otherwise, parse the value as an integer
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue)) {
        setBet(parsedValue);
      }
    }
  }}
  placeholder="Place your bet"
  className="p-2 text-black rounded"
  disabled={gameStarted}
/>
              <button
                onClick={handleStart}
                disabled={gameStarted}
                className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Deal
              </button>
            </div>
            <div className="flex justify-center space-x-4 mb-4">
              <button
                onClick={handleHit}
                disabled={!gameStarted || gameOver}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Hit
              </button>
              <button
                onClick={handleStand}
                disabled={!gameStarted || gameOver}
                className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Stand
              </button>
              <button
                onClick={handleReset}
                disabled={!gameStarted}
                className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="mb-4">
              <h2 className="text-2xl font-bold text-[#FFD700]">
                Dealer's Hand ({gameOver ? dealerScore : '?'})
              </h2>
              <div className="flex space-x-2">
                {dealerHand.map((card, index) => (
                  <Card
                    key={index}
                    card={card}
                    isHidden={!gameOver && index === 1}
                  />
                ))}
              </div>
            </div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-[#FFD700]">
                Your Hand ({playerScore})
              </h2>
              <div className="flex space-x-2">
                {playerHand.map((card, index) => (
                  <Card key={index} card={card} />
                ))}
              </div>
            </div>
            <div className="mb-4">
              <p className="text-xl text-[#FFD700]">Balance: ${playerBalance}</p>
            </div>

            {result && (
              <p className="text-xl font-bold text-[#FFD700]">{result}</p>
            )}
          </div>

          {showBalanceError && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-[#11111B] p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Insufficient Balance</h2>
                <p className="text-gray-300">You don't have enough balance to place this bet.</p>
                <button
                  onClick={() => setShowBalanceError(false)}
                  className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Close
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