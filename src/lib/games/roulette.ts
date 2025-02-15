'use server';

type BetType = 'number' | 'color' | 'odd-even';
type Color = 'red' | 'black' | 'green';

const numbers = Array.from({ length: 37 }, (_, i) => i);
const redNumbers = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

export async function Spin(): Promise<{ result: number; color: Color; }> {
    const result = numbers[Math.floor(Math.random() * numbers.length)];
    let color: Color = 'green';
    if (result !== 0) {
        color = redNumbers.has(result) ? 'red' : 'black';
    }
    return { result, color };
}

export async function PlaceBet(betType: BetType, betValue: number | Color | 'odd' | 'even', amount: number) {
    const spinResult = await Spin();
    
    let win = false;

    switch (betType) {
        case 'number':
            if (typeof betValue === 'number' && betValue === spinResult.result) {
                win = true;
            }
            break;
        case 'color':
            if (typeof betValue === 'string' && betValue === spinResult.color) {
                win = true;
            }
            break;
        case 'odd-even':
            if (typeof betValue === 'string' && spinResult.result !== 0) {
                const isEven = spinResult.result % 2 === 0;
                if ((betValue === 'even' && isEven) || (betValue === 'odd' && !isEven)) {
                    win = true;
                }
            }
            break;
    }

    return {
        spinResult,
        win
    };
}
