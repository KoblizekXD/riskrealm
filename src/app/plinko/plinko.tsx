"use client";

import React, { useEffect, useRef, useState } from "react";

class PlinkoGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private balls: { x: number; y: number; vx: number; vy: number }[] = [];
  private pegs: { x: number; y: number }[] = [];
  private multipliers: number[] = [0.5, 1, 1.5, 2, 3, 5, 3, 2, 1.5, 1, 0.5];
  private gravity = 0.05;
  private friction = 0.99;
  private balance: number;
  private betAmount: number;

  constructor(canvasId: string, balance: number, betAmount: number) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.initPegs();
    this.balance = balance;
    this.betAmount = betAmount;
    this.animate();
  }

  initPegs() {
    // Top row with 3 pegs
    for (let row = 0; row < 8; row++) {
      const pegsInRow = row === 0 ? 3 : row + 3; // First row has 3 pegs, others have row + 1
      const startX = 250 - (pegsInRow - 1) * 25; // Center the pegs horizontally

      for (let col = 0; col < pegsInRow; col++) {
        this.pegs.push({ x: startX + col * 50, y: row * 50 + 50 });
      }
    }
  }

  dropBall() {
    if (this.balls.length < 15 && this.betAmount > 0 && this.betAmount <= this.balance) {
      this.balance -= this.betAmount;
      this.balls.push({ x: 250, y: 0, vx: 0, vy: 0 });
    }
  }

  update() {
    this.balls.forEach((ball, index) => {
      ball.vy += this.gravity;
      ball.vx *= this.friction;
      ball.vy *= this.friction;
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Side collision detection
      if (ball.x < 10 || ball.x > this.canvas.width - 10) {
        ball.vx = -ball.vx * 0.8;
        ball.x = ball.x < 10 ? 10 : this.canvas.width - 10;
      }

      // Peg collision detection
      this.pegs.forEach((peg) => {
        const dx = ball.x - peg.x;
        const dy = ball.y - peg.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 10) {
          ball.vx += Math.random() > 0.5 ? 1 : -1;
          ball.vy = -ball.vy * 0.8;
        }
      });

      // Bottom collision detection
      if (ball.y > this.canvas.height - 50) {
        const slot = Math.floor(ball.x / 50);
        this.balance += this.betAmount * this.multipliers[slot];
        this.balls.splice(index, 1);
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "white";
    this.pegs.forEach((peg) => {
      this.ctx.beginPath();
      this.ctx.arc(peg.x, peg.y, 5, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.balls.forEach((ball) => {
      this.ctx.beginPath();
      this.ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.ctx.fillStyle = "yellow";
    this.multipliers.forEach((multiplier, index) => {
      this.ctx.fillText(multiplier.toString(), index * 50 + 10, this.canvas.height - 20);
    });
  }

  animate = () => {
    this.update();
    this.draw();
    requestAnimationFrame(this.animate);
  };

  getBalance() {
    return this.balance;
  }
}

const Plinko = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<PlinkoGame | null>(null);
  const [balance, setBalance] = useState(100);
  const [betAmount, setBetAmount] = useState(1);

  useEffect(() => {
    if (canvasRef.current) {
      setGame(new PlinkoGame("plinkoCanvas", balance, betAmount));
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Plinko Game</h1>
      <p className="mb-2">Balance: ${balance.toFixed(2)}</p>
      <input
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(parseFloat(e.target.value) || 1)}
        className="mb-2 px-2 py-1 border border-gray-300 text-black"
      />
      <canvas ref={canvasRef} id="plinkoCanvas" width="500" height="600" className="border-2 border-white"></canvas>
      <button
        onClick={() => {
          game?.dropBall();
          setBalance(game?.getBalance() ?? balance);
        }}
        className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
      >
        Drop Ball
      </button>
    </div>
  );
};

export default Plinko;