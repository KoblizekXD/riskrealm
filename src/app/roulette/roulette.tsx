"use client";

import { PlaceBet } from "@/lib/games/roulette";
import { useState } from "react";

export default function Roulette() {
  const [betType, setBetType] = useState<"number" | "color" | "odd-even">(
    "number",
  );
  const [betValue, setBetValue] = useState<
    number | "red" | "black" | "odd" | "even"
  >(0);
  const [result, setResult] = useState<number | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [win, setWin] = useState<boolean | null>(null);

  const handleBetTypeChange = (newBetType: "number" | "color" | "odd-even") => {
    setBetType(newBetType);
    if (newBetType === "number") setBetValue(0);
    if (newBetType === "color") setBetValue("red"); // Defaultně třeba red
    if (newBetType === "odd-even") setBetValue("odd"); // Defaultně třeba odd
  };

  const handleSpin = async () => {
    const betResult = await PlaceBet(betType, betValue);

    setResult(betResult.spinResult.result);
    setColor(betResult.spinResult.color);
    setWin(betResult.win);
  };

  return (
    <div className="bg-gradient-to-b from-[#1a1124] to-[#110b18] text-[#d0bfff] flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4 text-[#D4AF37] drop-shadow-[0_0_5px_#CFAF4A]">
        Roulette
      </h1>

      <div className="mb-4">
        <label>Bet Type: </label>
        <select
          value={betType}
          onChange={(e) =>
            handleBetTypeChange(
              e.target.value as "number" | "color" | "odd-even",
            )
          }>
          <option value="number">Number</option>
          <option value="color">Color</option>
          <option value="odd-even">Odd/Even</option>
        </select>
      </div>

      {betType === "number" && (
        <div className="mb-4">
          <label>Choose Number (0-36): </label>
          <input
            className="w-10"
            type="number"
            value={betValue as number}
            onChange={(e) => setBetValue(Number(e.target.value))}
            min="0"
            max="36"
          />
        </div>
      )}

      {betType === "color" && (
        <div className="mb-4">
          <label>Choose Color: </label>
          <select
            value={betValue as string}
            onChange={(e) => setBetValue(e.target.value as "red" | "black")}>
            <option value="red">Red</option>
            <option value="black">Black</option>
          </select>
        </div>
      )}

      {betType === "odd-even" && (
        <div className="mb-4">
          <label>Choose: </label>
          <select
            value={betValue as string}
            onChange={(e) => setBetValue(e.target.value as "odd" | "even")}>
            <option value="odd">Odd</option>
            <option value="even">Even</option>
          </select>
        </div>
      )}

      <button
        onClick={handleSpin}
        className="bg-[#D4AF37] text-white font-bold px-3 py-2 rounded-lg hover:bg-[#d4bf37] hover:shadow-[0px_0px_15px_#FFD700] shadow-lg md:px-4 cursor-pointer hover:scale-110 active:scale-105 transition transform text-sm mb-4 md:mb-0">
        Spin
      </button>

      {result !== null && (
        <div className="mt-4 flex flex-col items-center text-center">
          <p>
            Result: {result} ({color})
          </p>
          <p>{win ? "You win! " : "You lose!"}</p>
        </div>
      )}
    </div>
  );
}
