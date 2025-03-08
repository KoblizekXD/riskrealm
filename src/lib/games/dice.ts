// dice.ts
export class DiceGame {
    private dicePrediction: number;
    private target: 'over' | 'under';
  
    constructor(diceCount: number, target: 'over' | 'under') {
      this.dicePrediction = diceCount;
      this.target = target;
    }
  
    public rollDice(): number {
      return Math.floor(Math.random() * 6) + 1;
    }
  
    rollDices(): { dice1: number, dice2: number, sum: number } {
      let dice1 = this.rollDice();
      let dice2 = this.rollDice();
      let sum = dice1 + dice2;
      
      return { dice1, dice2, sum };
    }


  
    checkWin(total: number): boolean {
      if (this.target === 'over') {
        return total >= this.dicePrediction;
      } else {
        return total <= this.dicePrediction;
      }
    }
  }