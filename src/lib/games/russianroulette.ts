"use server";

export async function startRussianRoulette(balance: number, bet: number) {
  if (bet > balance) {
    throw new Error("Insufficient balance");
  }
  const oldBalance = balance;
  const playerBalance = balance - bet;
  const bulletPosition = Math.floor(Math.random() * 6);

  return {
    playerBalance,
    bulletPosition,
    oldBalance,
    gameOver: false,
    bet,
  };
}

export async function fire(
  currentChamber: number,
  bulletPosition: number,
  balance: number,
  bet: number,
) {
  let playerBalance = balance;
  let result = "";
  let gameOver = false;

  if (currentChamber === bulletPosition) {
    result = "Bang! You lost your bet.";
    gameOver = true;
  } else {
    result = "Click! You survived this round.";
    if (currentChamber === 5) {
      // Last chamber
      playerBalance += bet * 2; // Reward for surviving all chambers
      result = "You survived all chambers! You win double your bet!";
      gameOver = true;
    }
  }

  return {
    currentChamber: currentChamber + 1,
    playerBalance,
    result,
    gameOver,
  };
}

export async function cashout(
  currentChamber: number,
  balance: number,
  bet: number,
) {
  let playerBalance = balance;
  let result = "";

  let rewardMultiplier = 1;
  switch (currentChamber) {
    case 0:
      rewardMultiplier = 0.8;
      break;
    case 1:
      rewardMultiplier = 1.0;
      break;
    case 2:
      rewardMultiplier = 1.2;
      break;
    case 3:
      rewardMultiplier = 1.5;
      break;
    case 4:
      rewardMultiplier = 2.0;
      break;
    default:
      rewardMultiplier = 1.0;
  }

  const cashoutAmount = Math.floor(bet * rewardMultiplier);
  playerBalance += cashoutAmount;

  result = `You cashed out after ${currentChamber + 1} shots and received ${cashoutAmount} tickets!`;

  return {
    playerBalance,
    result,
    gameOver: true,
  };
}