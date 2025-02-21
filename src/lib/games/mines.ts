// app/api/games/mines/route.ts (for Next.js 13+)
import { NextResponse } from 'next/server';

const GRID_SIZE: number = 5;
const MINE_COUNT: number = 3;

type GameState = {
    board: boolean[];
    mines: number[];
    cashout: number;
    gameOver: boolean;
    result: string;
};

export async function GET() {
    let mines: Set<number> = new Set();
    while (mines.size < MINE_COUNT) {
        mines.add(Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE)));
    }

    const gameState: GameState = {
        board: Array(GRID_SIZE * GRID_SIZE).fill(false),
        mines: Array.from(mines),
        cashout: 1.0,
        gameOver: false,
        result: "",
    };

    return NextResponse.json(gameState);
}

export async function POST(request: Request) {
    const { board, mines, index, cashout }: { board: boolean[], mines: number[], index: number, cashout: number } = await request.json();

    if (board[index] || mines.includes(index)) {
        return NextResponse.json({
            board,
            mines,
            cashout,
            gameOver: true,
            result: 'Boom! You hit a mine.',
        });
    }

    let newBoard: boolean[] = [...board];
    newBoard[index] = true;
    let newCashout: number = cashout + 0.2;

    return NextResponse.json({
        board: newBoard,
        mines,
        cashout: newCashout,
        gameOver: false,
        result: "",
    });
}

export async function PUT(request: Request) {
    const { cashout }: { cashout: number } = await request.json();
    return NextResponse.json({
        winnings: cashout,
        gameOver: true,
        result: 'You successfully cashed out!',
    });
}
