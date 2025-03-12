"use server";

const suits = ["H", "D", "C", "S"];
const ranks = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

let deck: string[] = [];

const messages = [
  "So close! Maybe next time luck will be on your side!",
  "Even the best have off days. Give it another shot!",
  "Luck is like a cat—sometimes it comes when you least expect it!",
  "Hey, every legend has a comeback story!",
  "The reels owe you one! Try again?",
  "That was just a warm-up, right?",
  "Think of it as paying rent for the jackpot!",
  "The casino gods demand more sacrifices!",
];

const getRandomMessage = () =>
  messages[Math.floor(Math.random() * messages.length)];

function initializeDeck() {
  deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
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
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return deck.pop()!;
}
const formatNumber = (num: number) => num.toLocaleString("en-US");

function calculateScore(hand: string[]): number {
  let score = 0;
  let aces = 0;
  for (const card of hand) {
    const rank = card.slice(0, -1);
    if (rank === "A") {
      score += 11;
      aces++;
    } else if (["J", "Q", "K"].includes(rank)) {
      score += 10;
    } else {
      score += Number.parseInt(rank, 10);
    }
  }
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  return score;
}

export async function startGame(balance: number, bet: number) {
  let playerBalance = balance;
  if (bet > playerBalance) {
    throw new Error("Insufficient balance");
  }
  const oldBalance = playerBalance;
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
    oldBalance,
    gameOver: false,
    bet,
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
    bet,
  };
}

export async function stand(
  balance: number,
  dealerHand: string[],
  playerScore: number,
  bet: number,
) {
  let playerBalance = balance;
  const currentDealerHand = [...dealerHand];
  let currentDealerScore = calculateScore(currentDealerHand);

  while (currentDealerScore < 17) {
    currentDealerHand.push(dealCard());
    currentDealerScore = calculateScore(currentDealerHand);
  }

  let result = "Draw";
  let resultMsg = "";
  let winner = "";
  if (currentDealerScore > 21) {
    result = "Player wins!";
    winner = "player";
    playerBalance += bet * 2;
    resultMsg = `You win: ${formatNumber(bet*2)}`;
  } else if (currentDealerScore > playerScore) {
    result = "Dealer wins!";
    winner = "dealer";
    resultMsg = getRandomMessage();
  } else if (currentDealerScore < playerScore) {
    result = "Player wins!";
    playerBalance += bet * 2;
    resultMsg = `You win: ${formatNumber(bet*2)}`;
    winner = "player";
  } else {
    playerBalance += bet;
    resultMsg = "No money was taken";
  }

  return {
    dealerHand: currentDealerHand,
    dealerScore: currentDealerScore,
    gameOver: true,
    result,
    playerBalance,
    resultMsg,
    winner,
  };
}
