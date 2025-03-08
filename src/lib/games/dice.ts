// dice.ts
export class DiceGame {
    private dicePrediction: number;
    private target: 'over' | 'under';
  
    constructor(diceCount: number, target: 'over' | 'under') {
      this.dicePrediction = diceCount;
      this.target = target;
    }
  
    private rollDice(): number {
      return Math.floor(Math.random() * 6) + 1;
    }
  
    rollDices(): number {
      let sum = 0;
      for (let i = 0; i < 2; i++) {
        sum += this.rollDice();
      }
      return sum;
    }
  
    checkWin(total: number): boolean {
      if (this.target === 'over') {
        return total >= this.dicePrediction;
      } else {
        return total <= this.dicePrediction;
      }
    }
  }