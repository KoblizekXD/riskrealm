//config

const pins = {
  startPins: 3,
  pinSize: 2,
  pinGap: 20,
};



const ball = {
  ballSize: 5,
};

const engine = {
  engineGravity: 1,
};

const world = {
  width: 390,
  height: 390,
};

export const config = {
  pins,
  ball,
  engine,
  world,
};

//Multipliers
export type LinesType = 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;



export type MultiplierValues =
  | 110
  | 88
  | 41
  | 33
  | 25
  | 18
  | 15
  | 10
  | 5
  | 3
  | 2
  | 1.5
  | 1
  | 0.5
  | 0.3;

type MultiplierLabelType = `block-${MultiplierValues}`;

const multBest = "plinko/multiplier-best.wav";
const multGood = "plinko/multiplier-good.wav";
const multRegular = "plinko/multiplier-regular.wav";
const multLow = "plinko/multiplier-low.wav";

const multiplierSounds = {
  110: multBest,
  88: multBest,
  41: multBest,
  33: multBest,
  25: multBest,
  18: multGood,
  15: multGood,
  10: multGood,
  5: multGood,
  3: multRegular,
  2: multRegular,
  1.5: multRegular,
  1: multRegular,
  0.5: multLow,
  0.3: multLow
} as const

export type MultiplierType = {
  label: MultiplierLabelType;
  img: string;
  sound: string;
};



const multipliers = {
  110: {
    img: "plinko/multiplier110.png",
    label: "block-110",
    sound: multBest,
  },
  88: {
    img: "plinko/multiplier88.png",
    label: "block-88",
    sound: multBest,
  },
  41: {
    img: "plinko/multiplier41.png",
    label: "block-41",
    sound: multBest,
  },
  33: {
    img: "plinko/multiplier33.png",
    label: "block-33",
    sound: multBest,
  },
  25: {
    img: "plinko/multiplier25.png",
    label: "block-25",
    sound: multBest,
  },
  18: {
    img: "plinko/multiplier18.png",
    label: "block-18",
    sound: multGood,
  },
  15: {
    img: "plinko/multiplier15.png",
    label: "block-15",
    sound: multGood,
  },
  10: {
    img: "plinko/multiplier10.png",
    label: "block-10",
    sound: multGood,
  },
  5: {
    img: "plinko/multiplier5.png",
    label: "block-5",
    sound: multGood,
  },
  3: {
    img: "plinko/multiplier3.png",
    label: "block-3",
    sound: multRegular,
  },
  2: {
    img: "plinko/multiplier2.png",
    label: "block-2",
    sound: multRegular,
  },
  1.5: {
    img: "plinko/multiplier1.5.png",
    label: "block-1.5",
    sound: multRegular,
  },
  1: {
    img: "plinko/multiplier1.png",
    label: "block-1",
    sound: multRegular,
  },
  0.5: {
    img: "plinko/multiplier0.5.png",
    label: "block-0.5",
    sound: multLow,
  },
  0.3: {
    img: "plinko/multiplier0.3.png",
    label: "block-0.3",
    sound: multLow,
  },
} as const;

export type MultipliersType = keyof typeof multipliers;

function getMultiplier(value: MultipliersType): MultiplierType {
  return multipliers[value];
}

export const multiplyBlocks16Lines = [
  getMultiplier(110),
  getMultiplier(41),
  getMultiplier(10),
  getMultiplier(5),
  getMultiplier(3),
  getMultiplier(1.5),
  getMultiplier(1),
  getMultiplier(0.5),
  getMultiplier(0.3),
  getMultiplier(0.5),
  getMultiplier(1),
  getMultiplier(1.5),
  getMultiplier(3),
  getMultiplier(5),
  getMultiplier(10),
  getMultiplier(41),
  getMultiplier(110),
];


export function getMultiplierSound(value: MultiplierValues): string {
  return multiplierSounds[value]
}