"use server";


// Simulate a server-side balance store
//let serverBalance = 9999;

// Function to update the balance securely
export async function incrementBalance(amount: number, balance: number) {
  balance += amount;
  return balance;
}

export async function decrementBalance(amount: number, balance: number) {
    balance -= amount;
    return balance;
  }

// Function to calculate the multiplier securely
export async function calcWin(multiplierValue: number, ballValue: number){
  return +multiplierValue * ballValue;
}

// Function to validate if a new ball can be added
export async function canAddBall(inGameBallsCount: number): Promise<boolean> {
  return inGameBallsCount < 15;
}