"use server";


import { getMultiplierByLinesQnt } from '../../app/plinko/game/config';

type LinesType = 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
type MultiplierValues = 110 | 88 | 41 | 33 | 25 | 18 | 15 | 10 | 5 | 3 | 2 | 1.5 | 1 | 0.5 | 0.3;

// Simulate a server-side balance store
let serverBalance = 9999;

// Function to update the balance securely
export async function updateBalance(amount: number): Promise<number> {
  serverBalance += amount;
  return serverBalance;
}

// Function to calculate the multiplier securely
export async function calculateMultiplier(lines: LinesType, ballValue: number): Promise<number> {
  const multipliers = getMultiplierByLinesQnt(lines);
  const randomIndex = Math.floor(Math.random() * multipliers.length);
  const multiplierValue = +multipliers[randomIndex].label.split('-')[1] as MultiplierValues;
  return ballValue * multiplierValue;
}

// Function to validate if a new ball can be added
export async function canAddBall(inGameBallsCount: number): Promise<boolean> {
  return inGameBallsCount < 15;
}