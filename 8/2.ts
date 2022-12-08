import { notUndefined } from "../libtapete.ts";
import "../langExts/Object/thrush.ts";
import {
  Cell,
  Direction,
  Directions,
  numberLines,
  populateCells,
} from "./1.ts";

export function countSightings(
  arr: Cell<number>[],
  direction: Direction,
): void {
  arr.forEach((cell, i) => {
    const prevTallIndex = arr
      .slice(0, i)
      .findLastIndex((prev) => prev.height >= cell.height);

    if (prevTallIndex === -1) {
      cell[direction] = i;
    } else {
      cell[direction] = i - prevTallIndex;
    }
  });
}

export const sceneries = (numberLines: number[][]): Cell<number>[][] =>
  populateCells(numberLines, countSightings);

const lines = sceneries(numberLines);

const scenicScore = (c: Cell<number>): number =>
  Directions
    .map((d: Direction) => notUndefined(c[d]))
    .reduce((a, b) => a * b);

const maxScenicScore = (board: Cell<number>[][]): number =>
  board
    .flatMap((l) => l.map(scenicScore))
    .reduce((a, b) => Math.max(a, b));

const a = maxScenicScore(lines);

export default a;

if (import.meta.main) {
  console.log(a);
}
