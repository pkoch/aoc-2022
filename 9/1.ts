import { assertNever, input_reader, toNumber } from "../libtapete.ts";
import "../langExts/Object/thrush.ts";

export const Directions = [
  "U",
  "D",
  "L",
  "R",
] as const;

export type Direction = typeof Directions[number];

const isDirection = (s: string): s is Direction =>
  Directions.includes(s as Direction);

export const decode = (s: string): Direction[] => {
  return s
    .trim()
    .split("\n")
    .flatMap(decodeDirections);
};

const decodeDirections = (s: string): Direction[] => {
  const [direction, nS] = s.trim().split(" ");
  const n = toNumber(nS);
  if (!isDirection(direction)) return assertNever(direction);

  const result = new Array(n);
  result.fill(direction);
  return result;
};

export interface Coordinate {
  x: number;
  y: number;
}

export const move = (c: Coordinate, d: Direction, n = 1): Coordinate => {
  switch (d) {
    case "U":
      return { ...c, y: c.y + n };
    case "D":
      return { ...c, y: c.y - n };
    case "R":
      return { ...c, x: c.x + n };
    case "L":
      return { ...c, x: c.x - n };
    default:
      return assertNever(d);
  }
};

const areTrouching = (head: Coordinate, tail: Coordinate): boolean => {
  return !(
    tail.x < head.x - 1 ||
    tail.x > head.x + 1 ||
    tail.y < head.y - 1 ||
    tail.y > head.y + 1
  );
};

export const chase = (head: Coordinate, tail: Coordinate): Coordinate => {
  if (areTrouching(tail, head)) return tail;

  const dx = head.x - tail.x;
  const dy = head.y - tail.y;

  return {
    x: tail.x + Math.sign(dx),
    y: tail.y + Math.sign(dy),
  };
};

interface Board {
  head: Coordinate;
  tail: Coordinate;
  tailTrail: Coordinate[];
}

const newBoard = (): Board => {
  return {
    head: { x: 0, y: 0 },
    tail: { x: 0, y: 0 },
    tailTrail: [],
  };
};

const advanceBoard = (board: Board, direction: Direction): Board => {
  const { head: oldHead, tail: oldTail, tailTrail: oldTailTrail } = board;

  const head = move(oldHead, direction);
  const tail = chase(head, oldTail);
  const tailTrail = [...oldTailTrail, tail];

  return { head, tail, tailTrail };
};

export const countUnique = <T>(arr: T[]): number =>
  [...new Set(arr.map((o) => JSON.stringify(o)))].length;

export const directions = decode(await input_reader(import.meta.resolve));

export const countUniqueTailPositions = <
  Board extends { tailTrail: Coordinate[] },
>(
  advanceBoard: (b: Board, d: Direction) => Board,
  newBoard: () => Board,
) =>
  directions
    .reduce(advanceBoard, newBoard())
    .tailTrail
    .thrush(countUnique);

const a = countUniqueTailPositions(advanceBoard, newBoard);

export default a;

if (import.meta.main) {
  console.log(a);
}
