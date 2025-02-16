'use server';

const suits = ['H', 'D', 'C', 'S'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck: string[] = [];
let playerBalance = 1000; 

function initializeDeck() {
    deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push(`${rank}${suit}`);
        }
    }
    shuffleDeck();
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealCard(): string {
    if (deck.length === 0) {
        initializeDeck();
    }
    return deck.pop()!;
}

function calculateScore(hand: string[]): number {
    let score = 0;
    let aces = 0;
    for (let card of hand) {
        const rank = card.slice(0, -1);
        if (rank === 'A') {
            score += 11;
            aces++;
        } else if (['J', 'Q', 'K'].includes(rank)) {
            score += 10;
        } else {
            score += parseInt(rank, 10);
        }
    }
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }
    return score;
}

export async function startGame(bet: number) {
    if (bet > playerBalance) {
        throw new Error('Insufficient balance');
    }
    playerBalance -= bet;
    initializeDeck();
    const playerHand = [dealCard(), dealCard()];
    const dealerHand = [dealCard(), dealCard()];
    return {
        playerHand,
        dealerHand,
        playerScore: calculateScore(playerHand),
        dealerScore: calculateScore(dealerHand),
        playerBalance,
        gameOver: false,
        bet
    };
}

export async function hit(playerHand: string[], bet: number) {
    const newHand = [...playerHand, dealCard()];
    const newScore = calculateScore(newHand);
    const gameOver = newScore > 21;
    return {
        playerHand: newHand,
        playerScore: newScore,
        gameOver,
        bet
    };
}

export async function stand(dealerHand: string[], playerScore: number, bet: number) {
    let currentDealerHand = [...dealerHand];
    let currentDealerScore = calculateScore(currentDealerHand);

    while (currentDealerScore < 17) {
        currentDealerHand.push(dealCard());
        currentDealerScore = calculateScore(currentDealerHand);
    }

    let result = "Draw";
    if (currentDealerScore > 21) {
        result = "Player wins!";
        playerBalance += bet * 2;
    } else if (currentDealerScore > playerScore) {
        result = "Dealer wins!";
    } else if (currentDealerScore < playerScore) {
        result = "Player wins!";
        playerBalance += bet * 2;
    } else {
        playerBalance += bet;
    }

    return {
        dealerHand: currentDealerHand,
        dealerScore: currentDealerScore,
        gameOver: true,
        result,
        playerBalance
    };
}

export async function getGameState() {
    return {
        playerBalance
    };
}