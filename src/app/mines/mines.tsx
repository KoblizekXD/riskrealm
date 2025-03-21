"use client";

import DailyRewards from "@/components/daily-rewards";
import MyDialog from "@/components/dialog";
import Navbar from "@/components/navbar";
import Popover from "@/components/popover";
import Tooltip from "@/components/tooltip";
import type { User as UserType } from "@/lib/schemas";
import {
  canClaimStreak,
  updateBalance,
  updateGems,
} from "@/lib/supabase/actions";
import {
  Bomb,
  CandlestickChart,
  ChartCandlestick,
  ExternalLink,
  Menu,
  Settings,
  User,
} from "lucide-react";
import { Orbitron } from "next/font/google";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

export const orbitron = Orbitron({
  variable: "--font-luckiest-guy",
  subsets: ["latin"],
  weight: "variable",
});

const GRID_SIZE = 5;
const MINE_COUNT = 5;

export default function MinesGame({ user }: { user: UserType }) {
  const [board, setBoard] = useState<boolean[]>(
    Array(GRID_SIZE * GRID_SIZE).fill(false)
  );
  const [mines, setMines] = useState<number[]>([]);
  const [cashout, setCashout] = useState<number>(1.0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [resultMsg, setResultMsg] = useState<string>("");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [streakClaimable, setStreakClaimable] = useState(false);
  const [playerBalance, setPlayerBalance] = useState<number>(user.tickets);
  const [betValue, setBetValue] = useState<number>(0);
  const [startGame, setStartGame] = useState<boolean>(false);
  const [showBalanceError, setShowBalanceError] = useState<boolean>(false);
  const [showResultPopup, setShowResultPopup] = useState<boolean>(false);
  const [win, setWin] = useState<boolean>(false);

  const formatNumber = (num: number) => num.toLocaleString("en-US");

  useEffect(() => {
    const handleKeyPress = () => {
      if (showResultPopup) {
        setStartGame(false);
        setShowResultPopup(false);
      }
    };

    if (showResultPopup) {
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [showResultPopup]);

  const handleReset = () => {
    setShowResultPopup(false);
    setStartGame(false);
  };

  const handleStart = () => {
    if (betValue !== null) {
      if (betValue <= 0 || betValue > playerBalance) {
        setShowBalanceError(true);
        return;
      }

      const playPlantedBombSound = () => {
        const audio = new Audio("Sounds/bombPlanted.mp3");
        audio.play();
      };

      playPlantedBombSound();
    }
    setPlayerBalance((prevBalance) => {
      prevBalance = prevBalance - betValue;
      return prevBalance;
    });
    setStartGame(true);
    let newMines: number[] = [];
    while (newMines.length < MINE_COUNT) {
      let mine = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
      if (!newMines.includes(mine)) {
        newMines.push(mine);
      }
    }
    setBoard(Array(GRID_SIZE * GRID_SIZE).fill(false));
    setMines(newMines);
    setCashout(betValue);
    setGameOver(false);
    setResultMsg("");
  };

  const handleRevealTile = (index: number) => {
    if (gameOver || board[index]) return;

    if (!mines.includes(index)) {
      const playMineSound = () => {
        const audio = new Audio("Sounds/mineSound.mp3");
        audio.play();
      };

      playMineSound();
    }

    let newBoard = [...board];
    if (mines.includes(index)) {
      newBoard[index] = true;
      setBoard(newBoard);
      setGameOver(true);

      const playExplosionSound = () => {
        const audio = new Audio("Sounds/bombExplosion.mp3");
        audio.play();
      };

      playExplosionSound();

      setResultMsg("Boom! You hit a mine.");
      setWin(false);
      setShowResultPopup(true);
    } else {
      newBoard[index] = true;
      setBoard(newBoard);
      setCashout((prev) => Math.round(prev * 1.1));
    }
  };

  const handleChangeBetValue = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = +e.target.value;
    const newBetValue = value >= playerBalance ? playerBalance : value;
    setBetValue(Math.round(newBetValue));
  };

  const handleCashout = () => {
    setGameOver(true);
    setPlayerBalance((prevBalance) => {
      prevBalance = prevBalance + Math.round(cashout);
      return prevBalance;
    });
    setResultMsg(`You successfully cashed out ${formatNumber(cashout)}🎫!`);
    setWin(true);
    setShowResultPopup(true);
    if (Math.random() < 0.05) {
      updateGems(user.gems + 1);
    }

    const playWinSound = () => {
      const audio = new Audio("Sounds/winCash.wav");
      audio.play();
    };

    playWinSound();
  };

  useEffect(() => {
    updateBalance(playerBalance);
  }, [playerBalance]);

  useEffect(() => {
    canClaimStreak().then(setStreakClaimable);
  }, []);

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
          className={`relative text-center flex-grow p-0 md:p-0 lg:p-8 flex flex-col items-center overflow-y-auto my-auto mx-auto max-w-[1550px] lg:min-w-[1000px] transition-all duration-300 `}
        >
          <div className={`${startGame ? "w-fit" : "hidden"}`}>
            <h1 className="text-[#D4AF37] drop-shadow-[0_0_10px_#CFAF4A] text-5xl font-bold mb-16">
              Mines
            </h1>
            <div className="grid grid-cols-5 gap-2">
              {board.map((revealed, index) => (
                <button
                  key={index}
                  onClick={() => handleRevealTile(index)}
                  className={`w-12 h-12 ${
                    revealed ? "bg-[#1a1124]" : "bg-black"
                  } text-white flex items-center justify-center`}
                  disabled={revealed || gameOver}
                >
                  {revealed && mines.includes(index) ? (
                    <Bomb className="text-[#D4AF37] bg-[#1a1124]" size={48} />
                  ) : (
                    ""
                  )}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <p>Cashout: {formatNumber(cashout)}🎫</p>

              <button
                onClick={handleCashout}
                className="bg-[#D4AF37] text-white font-bold px-3 py-2 rounded-lg hover:bg-[#d4bf37] hover:shadow-[0px_0px_15px_#FFD700] shadow-lg md:px-4 cursor-pointer hover:scale-110 transition transform text-sm mb-4 md:mb-0"
              >
                Cashout
              </button>
            </div>
          </div>

          <div className={`${startGame ? "hidden" : "w-full"}`}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <span className="text-lg font-bold text-[#D4AF37]">
                  Place a Bet
                </span>
                <p className="text-xl text-[#FFD700]">
                  Balance: {formatNumber(playerBalance)}🎫
                </p>
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
                    onClick={() =>
                      setBetValue((prevBetValue) => prevBetValue + 100)
                    }
                    className="flex-1 rounded-md bg-[#1E1E1E] p-3 border border-[#D4AF37] cursor-pointer hover:bg-[#C0A236] transition-colors text-[#D4AF37] hover:text-[#1E1E1E] font-bold"
                  >
                    100
                  </button>
                  <button
                    onClick={() =>
                      setBetValue((prevBetValue) => prevBetValue + 1000)
                    }
                    className="flex-1 rounded-md bg-[#1E1E1E] p-3 border border-[#D4AF37] cursor-pointer hover:bg-[#C0A236] transition-colors text-[#D4AF37] hover:text-[#1E1E1E] font-bold"
                  >
                    1000
                  </button>
                  <button
                    onClick={() =>
                      setBetValue(
                        playerBalance % 2 === 0
                          ? playerBalance / 2
                          : (playerBalance - 1) / 2
                      )
                    }
                    className="flex-1 rounded-md bg-[#1E1E1E] p-3 border border-[#D4AF37] cursor-pointer hover:bg-[#C0A236] transition-colors text-[#D4AF37] hover:text-[#1E1E1E] font-bold"
                  >
                    ½
                  </button>
                  <button
                    onClick={() =>
                      setBetValue((prevBetValue) => prevBetValue * 2)
                    }
                    className="flex-1 rounded-md bg-[#1E1E1E] p-3 border border-[#D4AF37] cursor-pointer hover:bg-[#C0A236] transition-colors text-[#D4AF37] hover:text-[#1E1E1E] font-bold"
                  >
                    2x
                  </button>
                  <button
                    onClick={() => setBetValue(playerBalance)}
                    className="flex-1 rounded-md bg-[#1E1E1E] p-3 border border-[#D4AF37] cursor-pointer hover:bg-[#C0A236] transition-colors text-[#D4AF37] hover:text-[#1E1E1E] font-bold"
                  >
                    Max
                  </button>
                </div>
              </div>

              <button
                onClick={handleStart}
                className="w-full rounded-md bg-[#1E1E1E] px-6 py-4 font-bold text-[#D4AF37] hover:bg-[#C0A236] hover:text-[#1E1E1E] focus:outline-none border cursor-pointer border-[#D4AF37]"
              >
                Bet
              </button>
            </div>
          </div>
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
                  className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {showResultPopup && (
            <div className="fixed inset-0  backdrop-blur-[2px] flex items-center justify-center">
              <div className="bg-[#11111B]/90  p-6 rounded-lg shadow-lg backdrop-blur-[2px] border border-[#D4AF37]">
                <p>{resultMsg}</p>
                <button
                  onClick={handleReset}
                  className="bg-[#D4AF37] text-white font-bold mt-2 px-3 py-2 rounded-lg hover:bg-[#d4bf37] hover:shadow-[0px_0px_15px_#FFD700] shadow-lg md:px-4 cursor-pointer hover:scale-110 transition transform text-sm mb-4 md:mb-0"
                >
                  New Game
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
