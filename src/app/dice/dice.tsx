"use client";

import { useState } from 'react';
import { DiceGame }  from "@/lib/games/dice";
import type { User as UserType } from "@/lib/schemas";

export default function Dice({ user }: { user: UserType }) {
  const [dicePrediction, setDicePrediction] = useState<number>(3);
  const [target, setTarget] = useState<'over' | 'under'>('over');
  const [result, setResult] = useState<number | null>(null);
  const [isWin, setIsWin] = useState<boolean | null>(null);

  const handleRoll = () => {
    const game = new DiceGame(dicePrediction, target);
    const total = game.rollDices();
    const win = game.checkWin(total);

    setResult(total);
    setIsWin(win);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <h1 className="text-3xl font-bold mb-6">Dice Game</h1>

      {/* Dice Count Input */}
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

      {/* Over/Under Buttons */}
      <div className="mb-4">
        <button
          onClick={() => setTarget('over')}
          className={`px-4 py-2 mr-2 ${
            target === 'over' ? 'bg-green-500 text-white' : 'bg-red-500'
          } rounded`}
        >
          Over
        </button>
        <button
          onClick={() => setTarget('under')}
          className={`px-4 py-2 ${
            target === 'under' ? 'bg-green-500 text-white' : 'bg-red-500'
          } rounded`}
        >
          Under
        </button>
      </div>

      {/* Roll Button */}
      <button
        onClick={handleRoll}
        className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Roll Dice
      </button>

      {/* Result Display */}
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
    </div>
  );
}