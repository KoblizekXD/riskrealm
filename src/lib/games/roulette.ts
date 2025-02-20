'use server';

type BetType = 'number' | 'color' | 'odd-even';
type Color = 'red' | 'black' | 'green';

const numbers = Array.from({ length: 37 }, (_, i) => i);
const redNumbers = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

export async function Spin() {
    const result = numbers[Math.floor(Math.random() * numbers.length)];
    const color: Color = result === 0 ? 'green' : redNumbers.has(result) ? 'red' : 'black';
    return { result, color };
}

export async function PlaceBet(betType: BetType, betValue: number | Color | 'odd' | 'even') {
    const spinResult = await Spin();
    let win = false;

    if (betType === 'number' && betValue === spinResult.result) win = true;
    if (betType === 'color' && betValue === spinResult.color) win = true;
    if (betType === 'odd-even' && spinResult.result !== 0) {
        const isEven = spinResult.result % 2 === 0;
        if ((betValue === 'even' && isEven) || (betValue === 'odd' && !isEven)) win = true;
    }

    return { spinResult, win };
}
