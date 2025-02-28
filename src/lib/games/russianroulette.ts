"use server";

import { updateBalance } from "@/lib/supabase/actions";

export async function startRussianRoulette(balance: number, bet: number) {
  if (bet > balance) {
    throw new Error("Insufficient balance");
  }
  const oldBalance = balance;
  const playerBalance = balance - bet;
  const bulletPosition = Math.floor(Math.random() * 6); // 6 chambers in a revolver

  // Aktualizace zůstatku v databázi
  await updateBalance(playerBalance);

  return {
    playerBalance,
    bulletPosition,
    oldBalance,
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

  // Aktualizace zůstatku v databázi
  await updateBalance(playerBalance);

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
  
    // Calculate cashout reward based on the current chamber
    let rewardMultiplier = 1; // Default multiplier
    switch (currentChamber) {
      case 0: // Po 1. shotu
        rewardMultiplier = 0.8;
        break;
      case 1: // Po 2. shotu
        rewardMultiplier = 1.0;
        break;
      case 2: // Po 3. shotu
        rewardMultiplier = 1.2;
        break;
      case 3: // Po 4. shotu
        rewardMultiplier = 1.5;
        break;
      case 4: // Po 5. shotu
        rewardMultiplier = 2.0;
        break;
      default:
        rewardMultiplier = 1.0; // Fallback
    }
  
    const cashoutAmount = Math.floor(bet * rewardMultiplier);
    playerBalance += cashoutAmount;
  
    result = `You cashed out after ${currentChamber + 1} shots and received ${cashoutAmount} tickets!`;
  
    // Aktualizace zůstatku v databázi
    await updateBalance(playerBalance);
  
    return {
      playerBalance,
      result,
    };
  }