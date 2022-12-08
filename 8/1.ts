import {
  input_reader,
  notUndefined,
  toNumber,
  transpose,
} from "../libtapete.ts";
import "../langExts/Object/thrush.ts";

export const Directions = [
  "up",
  "down",
  "left",
  "right",
] as const;

export type Direction = typeof Directions[number];

export interface Cell<T> {
  height: number;
  up: T | undefined;
  down: T | undefined;
  left: T | undefined;
  right: T | undefined;
}

const newCell = (height: number) => ({
  height,
  up: undefined,
  down: undefined,
  left: undefined,
  right: undefined,
});

export const decode = (s: string): number[][] => {
  return s
    .trim()
    .split("\n")
    .map((l) =>
      l
        .trim()
        .split("")
        .map(toNumber)
    );
};

function traceSight(arr: Cell<boolean>[], direction: Direction): void {
  let maxHeight = -1; // Border zeros are considered visible.
  for (const cell of arr) {
    cell[direction] = cell.height > maxHeight;
    maxHeight = Math.max(maxHeight, cell.height);
  }
}

const reversed = <T>(arr: T[]): T[] => [...arr].reverse();

export const populateCells = <T>(
  numberLines: number[][],
  populator: (c: Cell<T>[], d: Direction) => void,
): Cell<T>[][] => {
  const lines = numberLines.map((l) => l.map(newCell));
  // This reshapes the arrays, but they reference the same Cell objects.
  const columns = transpose(lines);

  ([
    ["left", lines],
    ["right", lines.map(reversed)],
    ["up", columns],
    ["down", columns.map(reversed)],
  ] as const).forEach(([direction, arrs]) =>
    arrs.forEach((arr) => populator(arr, direction))
  );

  return lines;
};

export const visibilities = (numberLines: number[][]): Cell<boolean>[][] =>
  populateCells(numberLines, traceSight);

export const numberLines = decode(await input_reader(import.meta.resolve));
const lines = visibilities(numberLines);

export const visible = (c: Cell<boolean>): boolean =>
  Directions
    .map((d: Direction) => notUndefined(c[d]))
    .reduce((a, b) => a || b);

export const countVisibles = (board: Cell<boolean>[][]): number =>
  board
    .flatMap((l) => l.map(visible))
    .filter((a) => a)
    .length;

const a = countVisibles(lines);

export default a;

if (import.meta.main) {
  console.log(a);
}
