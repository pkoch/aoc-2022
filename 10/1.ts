import {
  add,
  assertNever,
  crochet,
  input_reader,
  toNumber,
} from "../libtapete.ts";

type Noop = Record<never, never>;
const newNoop = (): Noop => ({});
const isNoop = (o: unknown): o is Noop =>
  o instanceof Object && Object.keys(o).length == 0;

interface AddX {
  n: number;
}
const newAddX = (n: number): AddX => ({ n });
const isAddX = (o: unknown): o is AddX => o instanceof Object && "n" in o;

type Instruction = Noop | AddX;

const decodeInstruction = (s: string): Instruction => {
  const [instS, arg] = s.split(" ");
  switch (instS) {
    case "noop":
      return newNoop();
    case "addx":
      return newAddX(toNumber(arg));
    default:
      return assertNever(s);
  }
};

export const decode = (s: string): Instruction[] =>
  s.trim().split("\n").map(decodeInstruction);

const intructionToCycleIncrements = (i: Instruction): number[] => {
  if (isAddX(i)) return [0, i.n];
  if (isNoop(i)) return [0];
  return assertNever(i);
};

export const instructions = decode(await input_reader(import.meta.resolve));

export const registerValues = (is: Instruction[]): number[] => {
  return crochet(is.flatMap(intructionToCycleIncrements), add, 1);
};

const signalStrengths = (ns: number[]): number[] =>
  [
    20,
    60,
    100,
    140,
    180,
    220,
  ].map((i) => ns[i - 1] * i);

const a = signalStrengths(registerValues(instructions)).reduce(add);

export default a;

if (import.meta.main) {
  console.log(a);
}
