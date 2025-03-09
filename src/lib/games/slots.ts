"use server";

const symbols = ["🍒", "🍋", "🍊", "🍇", "🔔", "⭐", "7️⃣"];

function spinReels(): string[] {
  const reels: string[] = [];
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * symbols.length);
    reels.push(symbols[randomIndex]);
  }
  return reels;
}

function calculateWin(reels: string[], bet: number): number {
  const [a, b, c] = reels;

  if (a === b && b === c) {
    if (a === "7️⃣") return bet * 10;
    if (a === "⭐") return bet * 5;
    if (a === "🔔") return bet * 3;
    return bet * 2;
  }

  if (a === b || b === c || a === c) {
    return bet * 1.5;
  }

  return 0;
}

export async function spinSlots(balance: number, bet: number) {
  if (bet > balance) {
    throw new Error("Insufficient balance");
  }

  const oldBalance = balance;
  balance -= bet;

  const reels = spinReels();
  const winAmount = calculateWin(reels, bet);
  balance += winAmount;

  return {
    reels,
    winAmount,
    balance,
    oldBalance,
    isWin: winAmount > 0,
  };
}
