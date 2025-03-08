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
    currentChamber: 0, // Initial chamber set to 0
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
      rewardMultiplier = 0.5;
      break;
    case 1:
      rewardMultiplier = 1;
      break;
    case 2:
      rewardMultiplier = 2;
      break;
    case 3:
      rewardMultiplier = 3;
      break;
    case 4:
      rewardMultiplier = 4;
      break;
    default:
      rewardMultiplier = 5;
  }

  const cashoutAmount = (bet * rewardMultiplier);
  playerBalance += cashoutAmount;

  result = `You cashed out after ${currentChamber} shots and received ${cashoutAmount} tickets!`;

  return {
    playerBalance,
    result,
    gameOver: true,
  };
}
