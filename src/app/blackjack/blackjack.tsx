'use client';

import { useEffect, useState } from 'react';
import { Start, Hit, DealerPlay, getGameState } from "@/lib/games/blackjack";
import type { User } from '@/lib/schemas';

export default function BlackJack({ user }: { user: User }) {
    const [playerHand, setPlayerHand] = useState<string[]>([]);
    const [dealerHand, setDealerHand] = useState<string[]>([]);
    const [playerScore, setPlayerScore] = useState<number>(0);
    const [dealerScore, setDealerScore] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [result, setResult] = useState<string>("");

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const fetchGameState = async () => {
            const gameState = await getGameState(playerHand, dealerHand, playerScore, dealerScore, gameOver);
            setPlayerHand(gameState.playerHand);
            setDealerHand(gameState.dealerHand);
            setPlayerScore(gameState.playerScore);
            setDealerScore(gameState.dealerScore);
            setGameOver(gameState.gameOver);
        };
        fetchGameState();
    }, []);

      
    const handleStart = async () => {
        const gameState = await Start();
        setPlayerHand(gameState.playerHand);
        setDealerHand(gameState.dealerHand);
        setPlayerScore(await gameState.playerScore);
        setDealerScore(await gameState.dealerScore);
        setGameOver(gameState.gameOver);
        setResult("");
    };


    const handleHit = async () => {
        const gameState = await Hit(playerHand);
        setPlayerHand(gameState.playerHand);
        setPlayerScore(gameState.playerScore);
        setGameOver(gameState.gameOver);
        if (gameState.gameOver) {
            setResult("Player busts! Dealer wins!");
        }
    };

    const handleDealerPlay = async () => {
        const gameState = await DealerPlay(dealerHand, playerScore);
        setDealerHand(gameState.dealerHand);
        setDealerScore(gameState.dealerScore);
        setGameOver(gameState.gameOver);
        setResult(gameState.result);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className='flex flex-col'>
                <button type="button" onClick={handleHit} disabled={gameOver}>Hit</button>
                <button type="button" onClick={handleDealerPlay} disabled={gameOver}>Stand</button>
                <button type="button" onClick={handleStart}>New Game</button>
            </div>
            <div>
                <p>Player: {playerHand.join(", ")} Score: {playerScore}</p>
                <p>Dealer: {dealerHand.join(", ")} Score: {dealerScore}</p>
                {result && <p>{result}</p>}
            </div>
        </div>
    );
}
