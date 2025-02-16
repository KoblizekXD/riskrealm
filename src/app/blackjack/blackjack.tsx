'use client';

import { useEffect, useState } from 'react';
import { startGame, hit, stand, getGameState } from "@/lib/games/blackjack";

export default function BlackJack() {
    const [playerHand, setPlayerHand] = useState<string[]>([]);
    const [dealerHand, setDealerHand] = useState<string[]>([]);
    const [playerScore, setPlayerScore] = useState<number>(0);
    const [dealerScore, setDealerScore] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [result, setResult] = useState<string>("");
    const [playerBalance, setPlayerBalance] = useState<number>(1000);
    const [bet, setBet] = useState<number>(0);

    useEffect(() => {
        const fetchGameState = async () => {
            const gameState = await getGameState();
            setPlayerBalance(gameState.playerBalance);
        };
        fetchGameState();
    }, []);

    const handleStart = async () => {
        if (bet <= 0) {
            alert("Please place a bet.");
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
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-green-700 text-white">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Hit or Stand?</h1>
                <div className="mb-4">
                    <input
                        type="number"
                        value={bet}
                        onChange={(e) => setBet(parseInt(e.target.value, 10))}
                        placeholder="Place your bet"
                        className="p-2 text-black"
                    />
                    <button onClick={handleStart} disabled={gameOver} className="ml-2 p-2 bg-blue-500 text-white">Deal</button>
                </div>
                <div className="flex justify-center space-x-4 mb-4">
                    <button onClick={handleHit} disabled={gameOver} className="p-2 bg-red-500 text-white">Hit</button>
                    <button onClick={handleStand} disabled={gameOver} className="p-2 bg-green-500 text-white">Stand</button>
                    <button onClick={handleReset} className="p-2 bg-yellow-500 text-white">Reset</button>
                </div>
                <div className="mb-4">
                    <h2 className="text-2xl font-bold">Dealer's Hand ({dealerScore})</h2>
                    <div className="flex space-x-2">
                        {dealerHand.map((card, index) => (
                            <div key={index} className="p-2 bg-white text-black rounded">
                                {card}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <h2 className="text-2xl font-bold">Your Hand ({playerScore})</h2>
                    <div className="flex space-x-2">
                        {playerHand.map((card, index) => (
                            <div key={index} className="p-2 bg-white text-black rounded">
                                {card}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <p className="text-xl">Balance: ${playerBalance}</p>
                </div>
                {result && <p className="text-xl font-bold">{result}</p>}
            </div>
        </div>
    );
}