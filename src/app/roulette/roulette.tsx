'use client';

import { useState } from 'react';
import { PlaceBet, Spin } from "@/lib/games/roulette";

export default function Roulette() {
    const [betType, setBetType] = useState<'number' | 'color' | 'odd-even'>('number');
    const [betValue, setBetValue] = useState<number | 'red' | 'black' | 'odd' | 'even'>(0);
    const [amount, setAmount] = useState<number>(10);
    const [result, setResult] = useState<number | null>(null);
    const [color, setColor] = useState<string | null>(null);
    const [winnings, setWinnings] = useState<number>(0);
    const [win, setWin] = useState<boolean | null>(null);

    const handleSpin = async () => {
        const betResult = await PlaceBet(betType, betValue);
        setResult(betResult.spinResult.result);
        setColor(betResult.spinResult.color);
        setWin(betResult.win);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Roulette</h1>
            
            <div className="mb-4">
                <label>Bet Type:</label>
                <select value={betType} onChange={(e) => setBetType(e.target.value as 'number' | 'color' | 'odd-even')}>
                    <option value="number">Number</option>
                    <option value="color">Color</option>
                    <option value="odd-even">Odd/Even</option>
                </select>
            </div>

            {betType === 'number' && (
                <div className="mb-4">
                    <label>Choose Number (0-36):</label>
                    <input type="number" value={betValue as number} onChange={(e) => setBetValue(Number(e.target.value))} min="0" max="36" />
                </div>
            )}

            {betType === 'color' && (
                <div className="mb-4">
                    <label>Choose Color:</label>
                    <select value={betValue as string} onChange={(e) => setBetValue(e.target.value as 'red' | 'black')}>
                        <option value="red">Red</option>
                        <option value="black">Black</option>
                    </select>
                </div>
            )}

            {betType === 'odd-even' && (
                <div className="mb-4">
                    <label>Choose Odd/Even:</label>
                    <select value={betValue as string} onChange={(e) => setBetValue(e.target.value as 'odd' | 'even')}>
                        <option value="odd">Odd</option>
                        <option value="even">Even</option>
                    </select>
                </div>
            )}


            <button onClick={handleSpin} className="px-4 py-2 bg-blue-500 text-white rounded">Spin</button>

            {result !== null && (
                <div className="mt-4">
                    <p>Result: {result} ({color})</p>
                    <p>{win ? "You win! " : "You lose!"}</p>
                </div>
            )}


            
        </div>
    );
}