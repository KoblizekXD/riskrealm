
//config



const pins = {
  startPins: 3,
  pinSize: 2,
  pinGap: 20
}

const ball = {
  ballSize: 5
}

const engine = {
  engineGravity: 1
}

const world = {
  width: 390,
  height: 390
}

export const config = {
  pins,
  ball,
  engine,
  world,
}


//Multipliers
export type LinesType = 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16

export type MultiplierValuesType =
  | 110
  | 88
  | 41
  | 33
  | 18
  | 15
  | 10
  | 8
  | 5
  | 3
  | 2
  | 1.5
  | 1
  | 0.5
  | 0.3



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
  | 0.3

type MultiplierLabelType = `block-${MultiplierValues}`

export type MultiplierType = {
  label: MultiplierLabelType
  img: string
}

const multipliers = {
  110: {
    img: 'plinko/multiplier110.png',
    label: 'block-110'
  },
  88: {
    img: 'plinko/multiplier88.png',
    label: 'block-88'
  },
  41: {
    img: 'plinko/multiplier41.png',
    label: 'block-41'
  },
  33: {
    img: 'plinko/multiplier33.png',
    label: 'block-33'
  },
  25: {
    img: 'plinko/multiplier25.png',
    label: 'block-25'
  },
  18: {
    img: 'plinko/multiplier18.png',
    label: 'block-18'
  },
  15: {
    img: 'plinko/multiplier15.png',
    label: 'block-15'
  },
  10: {
    img: 'plinko/multiplier10.png',
    label: 'block-10'
  },
  5: {
    img: 'plinko/multiplier5.png',
    label: 'block-5'
  },
  3: {
    img: 'plinko/multiplier3.png',
    label: 'block-3'
  },
  2: {
    img: 'plinko/multiplier2.png',
    label: 'block-2'
  },
  1.5: {
    img: 'plinko/multiplier1.5.png',
    label: 'block-1.5'
  },
  1: {
    img: 'plinko/multiplier1.png',
    label: 'block-1'
  },
  0.5: {
    img: 'plinko/multiplier0.5.png',
    label: 'block-0.5'
  },
  0.3: {
    img: 'plinko/multiplier0.3.png',
    label: 'block-0.3'
  }
} as const

export type MultipliersType = keyof typeof multipliers

export function getMultiplier(value: MultipliersType): MultiplierType {
  return multipliers[value]
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
  getMultiplier(110)
]

export const multiplyBlocks15Lines = [
  getMultiplier(88),
  getMultiplier(18),
  getMultiplier(10),
  getMultiplier(5),
  getMultiplier(3),
  getMultiplier(1.5),
  getMultiplier(0.5),
  getMultiplier(0.3),
  getMultiplier(0.3),
  getMultiplier(0.5),
  getMultiplier(1.5),
  getMultiplier(3),
  getMultiplier(5),
  getMultiplier(10),
  getMultiplier(18),
  getMultiplier(88)
]
export const multiplyBlocks14Lines = [
  getMultiplier(41),
  getMultiplier(15),
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
  getMultiplier(15),
  getMultiplier(41)
]
export const multiplyBlocks13Lines = [
  getMultiplier(41),
  getMultiplier(15),
  getMultiplier(5),
  getMultiplier(3),
  getMultiplier(1.5),
  getMultiplier(0.5),
  getMultiplier(0.3),
  getMultiplier(0.3),
  getMultiplier(0.5),
  getMultiplier(1.5),
  getMultiplier(3),
  getMultiplier(5),
  getMultiplier(15),
  getMultiplier(41)
]
export const multiplyBlocks12Lines = [
  getMultiplier(33),
  getMultiplier(10),
  getMultiplier(3),
  getMultiplier(2),
  getMultiplier(1.5),
  getMultiplier(0.5),
  getMultiplier(0.3),
  getMultiplier(0.5),
  getMultiplier(1.5),
  getMultiplier(2),
  getMultiplier(3),
  getMultiplier(10),
  getMultiplier(33)
]
export const multiplyBlocks11Lines = [
  getMultiplier(25),
  getMultiplier(5),
  getMultiplier(3),
  getMultiplier(2),
  getMultiplier(0.5),
  getMultiplier(0.3),
  getMultiplier(0.3),
  getMultiplier(0.5),
  getMultiplier(2),
  getMultiplier(3),
  getMultiplier(5),
  getMultiplier(25)
]
export const multiplyBlocks10Lines = [
  getMultiplier(25),
  getMultiplier(5),
  getMultiplier(2),
  getMultiplier(1.5),
  getMultiplier(0.5),
  getMultiplier(0.3),
  getMultiplier(0.5),
  getMultiplier(1.5),
  getMultiplier(2),
  getMultiplier(5),
  getMultiplier(25)
]
export const multiplyBlocks9Lines = [
  getMultiplier(10),
  getMultiplier(5),
  getMultiplier(2),
  getMultiplier(1.5),
  getMultiplier(0.3),
  getMultiplier(0.3),
  getMultiplier(1.5),
  getMultiplier(2),
  getMultiplier(5),
  getMultiplier(10)
]
export const multiplyBlocks8Lines = [
  getMultiplier(5),
  getMultiplier(3),
  getMultiplier(1.5),
  getMultiplier(0.5),
  getMultiplier(0.3),
  getMultiplier(0.5),
  getMultiplier(1.5),
  getMultiplier(3),
  getMultiplier(5)
]

export const multiplyBlocksByLinesQnt = {
  8: multiplyBlocks8Lines,
  9: multiplyBlocks9Lines,
  10: multiplyBlocks10Lines,
  11: multiplyBlocks11Lines,
  12: multiplyBlocks12Lines,
  13: multiplyBlocks13Lines,
  14: multiplyBlocks14Lines,
  15: multiplyBlocks15Lines,
  16: multiplyBlocks16Lines
}

export function getMultiplierByLinesQnt(value: LinesType): MultiplierType[] {
  return multiplyBlocksByLinesQnt[value]
}


