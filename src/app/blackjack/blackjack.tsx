'use client';

import { useState } from 'react';

export default function Blackjack() {
    const deck = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

    const [playerHand, setPlayerHand] = useState<string[]>([]);
    const [dealerHand, setDealerHand] = useState<string[]>([]);
    const [playerScore, setPlayerScore] = useState<number>(0);
    const [dealerScore, setDealerScore] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);

    function Start() {
        const playerCards = [Deal(), Deal()];
        const dealerCards = [Deal()];
        
        setPlayerHand(playerCards);
        setDealerHand(dealerCards);
        
        setPlayerScore(Score(playerCards));
        setDealerScore(Score(dealerCards));

        setGameOver(false); 

        console.log("Player: " + playerCards + " Score: " + playerScore);
        console.log("Dealer: " + dealerCards + " Score: " + dealerScore);
    }

    function Score(hand: string[]): number {
        let score = 0;
        hand.forEach(card => {
            if (card === "J" || card === "Q" || card === "K") {
                score += 10;
            } else if (card === "A") {
                score += 11; 
            } else {
                score += parseInt(card);
            }
        });

        
        let aceCount = hand.filter(card => card === "A").length;
        while (score > 21 && aceCount > 0) {
            score -= 10;
            aceCount--;
        }

        return score;
    }

    function Deal(): string {
        const num = Math.floor(Math.random() * deck.length);
        return deck[num];
    }

    function Hit() {
        if (gameOver) return;

        const newHand = [...playerHand, Deal()];
        const newScore = Score(newHand);
        
        setPlayerHand(newHand);
        setPlayerScore(newScore);

        if (newScore > 21) {
            alert("Player busts! Dealer wins!");
            setGameOver(true);
        }
    }

    function DealerPlay() {
        if (gameOver) return;

        let currentDealerHand = [...dealerHand];
        let currentDealerScore = dealerScore;

        while (currentDealerScore < 17) {
            currentDealerHand = [...currentDealerHand, Deal()];
            currentDealerScore = Score(currentDealerHand);
            console.log("Dealer: " + currentDealerHand + " Score: " + currentDealerScore);
        }

        setDealerHand(currentDealerHand);
        setDealerScore(currentDealerScore);

        if (currentDealerScore > 21) {
            alert("Dealer busts! Player wins!");
        } else if (currentDealerScore > playerScore) {
            alert("Dealer wins!");
        } else if (currentDealerScore < playerScore) {
            alert("Player wins!");
        } else {
            alert("Draw!");
        }

        setGameOver(true);
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className='flex flex-col'>
                <button onClick={Hit} disabled={gameOver}>Hit</button>
                <button onClick={DealerPlay} disabled={gameOver}>Stand</button>
                <button onClick={Start}>New Game</button>
            </div>
            <div>
                <p>Player: {playerHand.join(", ")} Score: {playerScore}</p>
                <p>Dealer: {dealerHand.join(", ")} Score: {dealerScore}</p>
            </div>
        </div>
    );
}
