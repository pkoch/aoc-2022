import {
  assertNever,
  input_reader,
  notUndefined,
  toNumber,
  transpose,
} from "../libtapete.ts";
import "../langExts/Object/tap.ts";

const Directions = [
  "up",
  "down",
  "left",
  "right",
] as const;

type Direction = typeof Directions[number];

type VisibilityStatus = boolean | undefined;

export interface Cell {
  height: number;
  up: VisibilityStatus;
  down: VisibilityStatus;
  left: VisibilityStatus;
  right: VisibilityStatus;
}

const newCell = (height: number) => ({
  height,
  up: undefined,
  down: undefined,
  left: undefined,
  right: undefined,
});

export const decode = (s: string): Cell[][] => {
  return s
    .trim()
    .split("\n")
    .map((l) =>
      l
        .trim()
        .split("")
        .map(toNumber)
        .map(newCell)
    )
    .tap(assingVisibilities);
};

function traceSight(arr: Cell[], direction: Direction): void {
  let maxHeight = -1; // Border zeros are considered visible.
  for (const cell of arr) {
    cell[direction] = cell.height > maxHeight;
    maxHeight = Math.max(maxHeight, cell.height);
  }
}

const reversed = <T>(arr: T[]): T[] => [...arr].reverse();

export const assingVisibilities = (lines: Cell[][]): void => {
  // This reshapes the arrays, but they reference the same Cell objects.
  const columns = transpose(lines);

  ([
    ["left", lines],
    ["right", lines.map(reversed)],
    ["up", columns],
    ["down", columns.map(reversed)],
  ] as const).map(([direction, arrs]) =>
    arrs.map((arr) => traceSight(arr, direction))
  );
};

const lines = decode(await input_reader(import.meta.resolve));

export const visible = (c: Cell): boolean => {
  return Directions.map((d: Direction) => notUndefined(c[d])).reduce((a, b) =>
    a || b
  );
};

export const countVisibles = (board: Cell[][]): number =>
  board.flatMap((l) => l.map(visible)).filter((a) => a).length;

const a = countVisibles(lines);

export default a;

if (import.meta.main) {
  console.log(a);
}
