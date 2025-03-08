"use client";

import { spinSlots } from "@/lib/games/slots";
import type { User as UserType } from "@/lib/schemas";
import { useState, useEffect } from "react";

const symbols = ["🍒", "🍋", "🍊", "🍇", "🔔", "⭐", "7️⃣"]; // Možné symboly na válcích

export default function Slots({ user }: { user: UserType }) {
  const [reels, setReels] = useState<string[]>(["🍒", "🍋", "🍊"]); // Výchozí symboly
  const [balance, setBalance] = useState<number>(user.tickets);
  const [oldBalance, setOldBalance] = useState<number>(0);
  const [bet, setBet] = useState<number | null>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [showResultPopup, setShowResultPopup] = useState<boolean>(false);
  const [winAmount, setWinAmount] = useState<number>(0);
  const [isWin, setIsWin] = useState<boolean>(false);
  const [spinningReels, setSpinningReels] = useState<string[][]>([
    ["🍒", "🍋", "🍊"],
    ["🍒", "🍋", "🍊"],
    ["🍒", "🍋", "🍊"],
  ]);

  const handleSpin = async () => {
    if (bet === null || bet <= 0 || bet > balance) {
      alert("Invalid bet amount!");
      return;
    }

    setIsSpinning(true);
    setShowResultPopup(false);

    // Simulace točení válců
    const spinDuration = 3000; // 3 sekundy
    const startTime = Date.now();

    const spinInterval = setInterval(() => {
      const tempReels = [
        [symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)]],
        [symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)]],
        [symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)]],
      ];
      setSpinningReels(tempReels);
    }, 100);

    setTimeout(async () => {
      clearInterval(spinInterval);

      const result = await spinSlots(balance, bet);
      setReels(result.reels);
      setBalance(result.balance);
      setOldBalance(result.oldBalance);
      setWinAmount(result.winAmount);
      setIsWin(result.isWin);

      // Nastavíme výsledné symboly
      setSpinningReels([result.reels, result.reels, result.reels]);

      // Delay před zobrazením popupu (např. 1 sekunda)
      setTimeout(() => {
        setShowResultPopup(true);
      }, 1000); // 1 sekunda delay

      setIsSpinning(false);
    }, spinDuration);
  };

  const handleReset = () => {
    setReels(["🍒", "🍋", "🍊"]);
    setBet(0);
    setShowResultPopup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1124] to-[#110b18] text-[#D4AF37] flex flex-col items-center justify-center">
      <header className="h-20 bg-[#151520] shadow-lg border-b-2 border-[#18181B] items-center flex w-full justify-between px-6">
        <div className="text-2xl font-bold text-[#d4af37]">Risk Realm - Slots</div>
        <div className="rounded gap-x-3 flex justify-center items-center bg-[#11111b] h-fit p-2">
          Balance: {balance} 🎫
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-8 text-[#D4AF37] drop-shadow-[0_0_5px_#CFAF4A]">
          Slots
        </h1>

        <div className="bg-[#11111B] p-6 rounded-lg shadow-lg border border-[#D4AF37]">
          <div className="flex gap-4 mb-6">
            {spinningReels.map((reel, reelIndex) => (
              <div
                key={reelIndex}
                className="text-6xl bg-[#1E1E2E] p-4 rounded-lg border border-[#D4AF37] overflow-hidden h-32 w-24 flex flex-col justify-center items-center relative"
              >
                <div
                  className="flex flex-col gap-4 transition-transform duration-1000"
                  style={{
                    transform: isSpinning ? `translateY(-${Math.random() * 100}%)` : "translateY(0)",
                  }}
                >
                  {reel.map((symbol, symbolIndex) => (
                    <div key={symbolIndex} className="text-center">
                      {symbol}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4">
            <input
              type="number"
              value={bet === null ? "" : bet}
              onChange={(e) => {
                const value = e.target.value;
                setBet(value === "" ? null : Number(value));
              }}
              placeholder="Place your bet"
              className="p-2 rounded text-white bg-[#11111B] border border-[#D4AF37] focus:outline-none focus:ring focus:ring-[#D4AF37] focus:ring-opacity-50 transition-colors"
              disabled={isSpinning}
            />
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="p-2 bg-[#D4AF37] text-white rounded hover:bg-[#FFD700] hover:text-black transition-colors cursor-pointer"
            >
              {isSpinning ? "Spinning..." : "Spin"}
            </button>
          </div>
        </div>
      </main>

      {showResultPopup && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center">
          <div className="bg-[#11111B]/90 p-6 rounded-lg shadow-lg backdrop-blur-[2px] border border-[#D4AF37]">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">
              {isWin ? "You Win!" : "No Win"}
            </h2>
            <p>Old Balance: {oldBalance} 🎫</p>
            <p>New Balance: {balance} 🎫</p>
            {isWin && <p>You won: {winAmount} 🎫</p>}
            <button
              onClick={handleReset}
              className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <footer className="h-16 flex mt-auto items-center justify-center border-t border-gray-800 bg-[#181825]">
        <p className="text-[#D4AF37] text-xs md:text-sm">
          © 2025 Risk Realm. All Rights Reserved. Spin until zero.
        </p>
      </footer>
    </div>
  );
}