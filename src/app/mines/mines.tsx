'use client';

import { useState } from 'react';
import { Bomb } from 'lucide-react';

const GRID_SIZE = 5;
const MINE_COUNT = 5;

export default function MinesGame() {
    const [board, setBoard] = useState<boolean[]>(Array(GRID_SIZE * GRID_SIZE).fill(false));
    const [mines, setMines] = useState<number[]>([]);
    const [cashout, setCashout] = useState<number>(1.0);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [result, setResult] = useState<string>("");

    const handleStart = () => {
        let newMines: number[] = [];
        while (newMines.length < MINE_COUNT) {
            let mine = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
            if (!newMines.includes(mine)) {
                newMines.push(mine);
            }
        }
        setBoard(Array(GRID_SIZE * GRID_SIZE).fill(false));
        setMines(newMines);
        setCashout(1.0);
        setGameOver(false);
        setResult("");
    };

    const handleRevealTile = (index: number) => {
        if (gameOver || board[index]) return;

        let newBoard = [...board];
        if (mines.includes(index)) {
            newBoard[index] = true;
            setBoard(newBoard);
            setGameOver(true);
            setResult("Boom! You hit a mine.");
        } else {
            newBoard[index] = true;
            setBoard(newBoard);
            setCashout(prev => prev + 0.2);
        }
    };

    const handleCashout = () => {
        setGameOver(true);
        setResult(`You successfully cashed out with ${cashout.toFixed(2)}x multiplier!`);
    };

    return (
        <div className="bg-gradient-to-b from-[#1a1124] to-[#110b18] text-[#d0bfff] flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-[#D4AF37] drop-shadow-[0_0_10px_#CFAF4A] text-5xl font-bold mb-16">Mines</h1>
            <div className="grid grid-cols-5 gap-2">
                {board.map((revealed, index) => (
                    <button
                        key={index}
                        onClick={() => handleRevealTile(index)}
                        className={`w-12 h-12 ${revealed ? 'bg-[#1a1124]' : 'bg-black'} text-white flex items-center justify-center`}
                        disabled={revealed || gameOver}
                    >
                        {revealed && mines.includes(index) ? (
                            <Bomb className="text-[#D4AF37] bg-[#1a1124]" size={48} />
                        ) : ''}
                    </button>
                ))}
            </div>
            <div className="mt-4">
                <p>Cashout: ${cashout.toFixed(2)}</p>
                <p>{result}</p>
                {gameOver ? (
                    <button onClick={handleStart} className="bg-[#D4AF37] text-white font-bold px-3 py-2 rounded-lg hover:bg-[#d4bf37] hover:shadow-[0px_0px_15px_#FFD700] shadow-lg md:px-4 cursor-pointer hover:scale-110 transition transform text-sm mb-4 md:mb-0">
                        New Game
                    </button>
                ) : (
                    <button onClick={handleCashout} className="bg-[#D4AF37] text-white font-bold px-3 py-2 rounded-lg hover:bg-[#d4bf37] hover:shadow-[0px_0px_15px_#FFD700] shadow-lg md:px-4 cursor-pointer hover:scale-110 transition transform text-sm mb-4 md:mb-0">
                        Cashout
                    </button>
                )}
            </div>
        </div>
    );
}
