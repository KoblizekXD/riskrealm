"use client";

import { useState } from 'react';
import { DiceGame }  from "@/lib/games/dice";
import type { User as UserType } from "@/lib/schemas";
import Link from "next/link";
import MyDialog from "@/components/dialog";
import { ExternalLink, Menu, Settings, User } from "lucide-react";
import Tooltip from "@/components/tooltip";
import { canClaimStreak, updateBalance } from "@/lib/supabase/actions";
import DailyRewards from "@/components/daily-rewards";
import Popover from "@/components/popover";

export default function Dice({ user }: { user: UserType }) {
  const [dicePrediction, setDicePrediction] = useState<number>(3);
  const [target, setTarget] = useState<'over' | 'under'>('over');
  const [result, setResult] = useState<number | null>(null);
  const [isWin, setIsWin] = useState<boolean | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [streakClaimable, setStreakClaimable] = useState(false);
  const [playerBalance, setPlayerBalance] = useState<number>(user.tickets);
  const [showBalanceError, setShowBalanceError] = useState<boolean>(false);
  const [showResultPopup, setShowResultPopup] = useState<boolean>(false);

  const handleRoll = () => {
    const game = new DiceGame(dicePrediction, target);
    const total = game.rollDices();
    const win = game.checkWin(total);

    setResult(total);
    setIsWin(win);
  };

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
          className={`relative text-center flex-grow p-4 lg:p-4 flex flex-col items-center overflow-y-auto mr-auto ml-auto max-w-[1550px] transition-all duration-300 ${
            isNavOpen ? "ml-64" : "ml-0"
          }`}>

          <h1 className="text-3xl font-bold mb-6">Dice Game</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Number of Dice (3-11):</label>
        <input
          type="number"
          min="3"
          max="11"
          value={dicePrediction}
          onChange={(e) => setDicePrediction(parseInt(e.target.value))}
          className="p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <button
          onClick={() => setTarget('over')}
          className={`px-4 py-2 mr-2 cursor-pointer ${
            target === 'over' ? 'bg-green-500 text-white' : 'bg-red-500'
          } rounded`}
        >
          Over
        </button>
        <button
          onClick={() => setTarget('under')}
          className={`px-4 py-2 cursor-pointer ${
            target === 'under' ? 'bg-green-500 text-white' : 'bg-red-500'
          } rounded`}
        >
          Under
        </button>
      </div>

      <button
        onClick={handleRoll}
        className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
      >
        Roll Dice
      </button>

      {result !== null && (
        <div className="mt-6">
          <p className="text-xl">
            You rolled: <span className="font-bold">{result}</span>
          </p>
          <p className="text-xl">
            Result: <span className={isWin ? 'text-green-600' : 'text-red-600'}>
              {isWin ? 'You Win!' : 'You Lose!'}
            </span>
          </p>
        </div>
      )}
          

          {showBalanceError && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-[#11111B] p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-[#FFD700] mb-4">
                  Insufficient Balance
                </h2>
                <p className="text-gray-300">
                  You don't have enough balance to place this bet.
                </p>
                <button
                  type="button"
                  onClick={() => setShowBalanceError(false)}
                  className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  Close
                </button>
              </div>
            </div>
          )}

          {showResultPopup && (
            <div className="fixed inset-0  backdrop-blur-[2px] flex items-center justify-center">
              <div className="bg-[#11111B]/90  p-6 rounded-lg shadow-lg backdrop-blur-[2px] border border-[#D4AF37]">
                <h2 className="text-2xl font-bold text-[#FFD700] mb-4">
                  {result}
                </h2>
                {}
                <br />
                
               
                <button
                  type="button"

                  className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer">
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