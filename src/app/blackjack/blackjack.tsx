'use client';

import { useState } from 'react';

export default function Blackjack() {
    const deck = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

    const [playerHand, setPlayerHand] = useState<string[]>([]);
    const [dealerHand, setDealerHand] = useState<string[]>([]);
    const [playerScore, setPlayerScore] = useState<number>(0);
    const [dealerScore, setDealerScore] = useState<number>(0);

    function Start() {
        const playerCards = [Deal(), Deal()];
        const dealerCards = [Deal(), Deal()];
        
        setPlayerHand(playerCards);
        setDealerHand(dealerCards);
        
        setPlayerScore(Score(playerCards));
        setDealerScore(Score(dealerCards));
        
        console.log("Player: " + playerCards + " Score: " + playerScore);
        console.log("Dealer: " + dealerCards + " Score: " + dealerScore);
    }

    function Score(hand: string[]): number {
        let score = 0;
        hand.forEach(card => {
            if (card === "J" || card === "Q" || card === "K" || card === "A") {
                score += 10;
            } else {
                score += parseInt(card);
            }
        });
        return score;
    }

    function Deal(): string {
        const num = Math.floor(Math.random() * deck.length);
        const card = deck[num];
        return card;
    }

    function Hit(hand: string[], setHand: React.Dispatch<React.SetStateAction<string[]>>, setScore: React.Dispatch<React.SetStateAction<number>>) {
        const newHand = [...hand, Deal()];
        setHand(newHand);
        setScore(Score(newHand));
    }

    function DealerPlay() {
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
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className='flex flex-col'>
                <button onClick={() => Hit(playerHand, setPlayerHand, setPlayerScore)}>Hit</button>
                <button onClick={DealerPlay}>Stand</button>
                <button onClick={Start}>New Game</button>
            </div>
            <div>
                <p>Player: {playerHand.join(", ")} Score: {playerScore}</p>
                <p>Dealer: {dealerHand.join(", ")} Score: {dealerScore}</p>
            </div>
        </div>
    );
}
