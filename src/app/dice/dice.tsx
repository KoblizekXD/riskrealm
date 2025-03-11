"use client";

import { useState, useEffect } from 'react';
import { DiceGame } from "@/lib/games/dice";
import type { User as UserType } from "@/lib/schemas";
import Link from "next/link";
import MyDialog from "@/components/dialog";
import { ExternalLink, Menu, Settings, User } from "lucide-react";
import Tooltip from "@/components/tooltip";
import { canClaimStreak, updateBalance } from "@/lib/supabase/actions";
import DailyRewards from "@/components/daily-rewards";
import Popover from "@/components/popover";
import Image from "next/image";
import "../globals.css";

export default function Dice({ user }: { user: UserType }) {
  const [target, setTarget] = useState<'over' | 'under'>('over');
  const [result, setResult] = useState<number | null>(null);
  const [isWin, setIsWin] = useState<boolean | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [streakClaimable, setStreakClaimable] = useState(false);
  const [playerBalance, setPlayerBalance] = useState<number>(user.tickets);
  const [showBalanceError, setShowBalanceError] = useState<boolean>(false);
  const [dicePrediction, setDicePrediction] = useState(3);
  const [betValue, setBetValue] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [diceFaces, setDiceFaces] = useState([1, 1]);
  const [newWin, setNewWin] = useState(0);
  const diceSound = "Dice/dice.wav";

  class DiceGameLogic {
    private static probabilityMap: { [key: number]: number } = {
      2: 1 / 36,
      3: 2 / 36,
      4: 3 / 36,
      5: 4 / 36,
      6: 5 / 36,
      7: 6 / 36,
      8: 5 / 36,
      9: 4 / 36,
      10: 3 / 36,
      11: 2 / 36,
      12: 1 / 36,
    };

    static getMultiplier(dicePrediction: number, target: "over" | "under"): number {
      let probability = 0;

      if (target === "over") {
        for (let i = dicePrediction; i <= 12; i++) {
          probability += DiceGameLogic.probabilityMap[i] || 0;
        }
      } else {
        for (let i = 2; i <= dicePrediction; i++) {
          probability += DiceGameLogic.probabilityMap[i] || 0;
        }
      }

      return probability > 0 ? Number((1 / probability).toFixed(2)) : 0;
    }
  }

  const formatNumber = (num: number) => num.toLocaleString("en-US");

  const handleRoll = () => {
    if (betValue === null) {
      return;
    }
    if (betValue > playerBalance) {
      setShowBalanceError(true);
      setBetValue(playerBalance);
      return;
    }
    setPlayerBalance((prevBalance) => prevBalance - betValue);
    updateBalance(playerBalance - betValue);
    setRolling(true);
    setResult(null);
    setNewWin(0);

    const game = new DiceGame(dicePrediction, target);
    const total = game.rollDices();
    const finalFaces = [total.dice1, total.dice2];
    const diceRollSound = new Audio(diceSound)
    diceRollSound.currentTime = 0
    diceRollSound.volume = 1 
    diceRollSound.play()

    let elapsed = 0;
    const rollInterval = setInterval(() => {
      setDiceFaces([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ]);
      elapsed += 500;

      if (elapsed >= 3000) {
        clearInterval(rollInterval);
        setDiceFaces(finalFaces);
        setRolling(false);

        const win = game.checkWin(total.sum);
        if (win) {
          const newWin = Math.round(betValue * multiplier);
          setNewWin((prevWin) => prevWin + newWin);
          setPlayerBalance((prevBalance) => prevBalance + newWin);
          updateBalance(playerBalance + newWin);
        }

        setResult(total.sum);
        setIsWin(win);
      }
    }, 500);
  };


  useEffect(() => {
    setMultiplier(DiceGameLogic.getMultiplier(dicePrediction, target));
  }, [dicePrediction, target]);

  useEffect(() => {
    canClaimStreak().then(setStreakClaimable);
  }, []);

  function Navbar({ isOpen }: { isOpen: boolean }) {
    return (
      <div
        className={`fixed left-0 top-0 h-screen bg-[#151520] shadow-lg border-r-2 border-[#18181B] transition-all duration-300 z-50 ${isOpen ? "w-64" : "hidden"
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
                  <span>{formatNumber(user.tickets)} 🎫</span>
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
                  <span>{formatNumber(user.tickets)} 🎫</span>
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
          className={`relative text-center flex-grow p-4 lg:p-4 flex flex-col items-center overflow-y-auto mr-auto ml-auto max-w-[1550px] transition-all duration-300 ${isNavOpen ? "ml-64" : "ml-0"
            }`}>


          <div className="bg-gray-900 text-white p-4 rounded-lg w-full min-w-xl mx-auto shadow-lg ">

            <div className="text-4xl font-bold mb-4 text-[#D4AF37] drop-shadow-[0_0_5px_#CFAF4A] text-center">
              Roll the Dice
            </div>




            <div className="flex mt-6">
              <div className="bg-gray-800 p-4 rounded-lg w-1/2">
                <button
                  className={`block w-full py-2 text-center text-lg font-bold cursor-pointer ${target === "over" ? "bg-green-500" : "bg-gray-700"
                    }`}
                  onClick={() => setTarget("over")}
                >
                  OVER
                </button>
                <button
                  className={`block w-full py-2 text-center text-lg font-bold mt-2 cursor-pointer ${target === "under" ? "bg-green-500" : "bg-gray-700"
                    }`}
                  onClick={() => setTarget("under")}
                >
                  UNDER
                </button>

                <div className="mt-4 text-center">
                  <label className="block text-sm font-medium mb-2 text-[#FFD700]">Prediction (3-11):</label>
                  <input
                    type="number"
                    min="3"
                    max="11"
                    value={dicePrediction}
                    onChange={(e) => setDicePrediction(parseInt(e.target.value))}
                    className="p-2 rounded text-[#FFD700] border border-[#D4AF37] focus:outline-none focus:ring focus:ring-[#D4AF37] focus:ring-opacity-50 transition-colors"
                  />
                  <div className="text-[#FFD700] mt-2 text-lg">PAYS: {multiplier}x</div>
                </div>
              </div>
              {result !== null && (
              <div className="p-4 w-1/2">
                <p className="text-xl">
                  You rolled: <span className="font-bold">{result}</span>
                </p>
                <p className="text-xl">
                  <span className={isWin ? 'text-green-600' : 'text-red-600'}>
                    {isWin ? 'You Win +' + formatNumber(newWin) + '🎫' : 'You Lose!'}
                  </span>                  
                </p>
              </div>
            )}
            </div>

            

            <div className="flex justify-center items-center mb-6 relative">
              <div className="relative w-full h-32 flex justify-center items-center">
                {diceFaces.map((face, index) => (
                  <Image
                    key={index}
                    src={`/dice/dice-${face}.png`}
                    alt={`Dice ${face}`}
                    width={64}
                    height={64}
                    className={`transition-transform duration-3000 ease-out mx-4 ${rolling ? "animate-dice-roll" : ""
                      }`}
                  />
                ))}
              </div>
            </div>


            <div className="mt-6 bg-gray-800 p-4 rounded">
            <div className="text-xl flex">Balance: <span className="text-[#FFD700] ml-2">{formatNumber(playerBalance)}</span>🎫</div>
              <div className="flex items-center mt-2 ">
                <span className="text-xl">Bet:</span>
                <input
                  type="number"
                  min="1"
                  max="30000"
                  placeholder='Enter your bet'
                  value={betValue === null ? '' : betValue}
                  onChange={(e) => setBetValue(parseFloat(e.target.value))}
                  className="p-2 rounded text-[#FFD700]  border border-[#D4AF37] focus:outline-none focus:ring focus:ring-[#D4AF37] focus:ring-opacity-50 transition-colors w-1/3 mx-2"
                />
                <button
                  type="button"
                  onClick={() => setBetValue(playerBalance)}
                  disabled={rolling}
                  className="p-2 bg-[#6D28D9] text-white rounded hover:bg-[#7C3AED] transition-colors cursor-pointer w-1/8 mx-1">
                  All In
                </button>
                <button
                  type="button"
                  onClick={() => setBetValue(playerBalance % 2 === 0 ? playerBalance / 2 : (playerBalance - 1) / 2)}
                  disabled={rolling}
                  className="p-2 bg-[#6D28D9] text-white rounded hover:bg-[#7C3AED] transition-colors cursor-pointer w-1/8 mx-1">
                  Half
                </button>
                <button
                  type="button"
                  onClick={() => setBetValue((prevBetValue) => (prevBetValue ?? 0) + 100)}
                  disabled={rolling}
                  className="p-2 bg-[#6D28D9] text-white rounded hover:bg-[#7C3AED] transition-colors cursor-pointer w-1/8 mx-1">
                  +100
                </button>
                
                <button
                  type="button"
                  onClick={() => setBetValue((prevBetValue) => (prevBetValue ?? 0) + 1000)}
                  disabled={rolling}
                  className="p-2 bg-[#6D28D9] text-white rounded hover:bg-[#7C3AED] transition-colors cursor-pointer w-1/8 mx-1">
                  +1000
                </button>
               
                
              </div>
              
            </div>



            {/* ROLL BUTTON */}
            <button
              onClick={handleRoll}
              className="mt-4 w-full py-3 bg-green-500 text-lg font-bold rounded hover:bg-green-600 cursor-pointer"
            >
              Roll Dice
            </button>
          </div>




          {showBalanceError && (
            <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center">
              <div className="bg-[#11111B]/90 backdrop-blur-[2px] p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-[#FFD700] mb-4">
                  Insufficient Balance
                </h2>
                <p className="text-gray-300">
                  You don't have enough balance to place this bet.
                </p>
                <button
                  type="button"
                  onClick={() => setShowBalanceError(false)}
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