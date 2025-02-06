'use server';

const deck = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

export async function Start() {
    const playerCards = [await Deal(), await Deal()];
    const dealerCards = [await Deal(), await Deal()];
    
    return {
        playerHand: playerCards,
        dealerHand: dealerCards,
        playerScore: Score(playerCards),
        dealerScore: Score(dealerCards),
        gameOver: false
    };
}

export async function Score(hand: string[]): Promise<number> {
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
    return score;
}

export async function Deal(): Promise<string> {
    const num = Math.floor(Math.random() * deck.length);
    return deck[num];
}

export async function Hit(playerHand: string[]) {
    const newHand = [...playerHand, await Deal()];
    const newScore = await Score(newHand);

    return {
        playerHand: newHand,
        playerScore: newScore,
        gameOver: newScore > 21
    };
}

export async function DealerPlay(dealerHand: string[], playerScore: number) {
    let currentDealerHand = [...dealerHand];
    let currentDealerScore = await Score(currentDealerHand);

    while (currentDealerScore < 17) {
        currentDealerHand = [...currentDealerHand, await Deal()];
        currentDealerScore = await Score(currentDealerHand);
    }

    let result = "Draw";
    if (currentDealerScore > 21) {
        result = "Player wins!";
    } else if (currentDealerScore > playerScore) {
        result = "Dealer wins!";
    } else if (currentDealerScore < playerScore) {
        result = "Player wins!";
    }

    return {
        dealerHand: currentDealerHand,
        dealerScore: currentDealerScore,
        gameOver: true,
        result
    };
}

export async function getGameState(playerHand: string[], dealerHand: string[], playerScore: number, dealerScore: number, gameOver: boolean) {
    return {
        playerHand,
        dealerHand,
        playerScore,
        dealerScore,
        gameOver
    };
}
