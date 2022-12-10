import {
  assertNever,
  input_reader,
  toNumber,
} from "../libtapete.ts";
import "../langExts/Object/thrush.ts";

export const Directions = [
  "U",
  "D",
  "L",
  "R",
] as const;

export type Direction = typeof Directions[number];

export const decode = (s: string): Direction[] => {
  return s
    .trim()
    .split("\n")
    .flatMap(decodeDirections);
};

const decodeDirections = (s: string): Direction[] => {
  const [direction, nS] = s.trim().split(" ");
  const n = toNumber(nS);
  if (!Directions.includes(direction as Direction)) {
    return assertNever(direction);
  }

  const result = new Array(n);
  result.fill(direction);
  return result;
};

export interface Coordinate {
  x: number;
  y: number;
}

const move = (c: Coordinate, d: Direction): Coordinate => {
  switch (d) {
    case "U":
      return { ...c, y: c.y + 1 };
    case "D":
      return { ...c, y: c.y - 1 };
    case "R":
      return { ...c, x: c.x + 1 };
    case "L":
      return { ...c, x: c.x - 1 };
    default:
      return assertNever(d);
  }
};

const areTrouching = (tail: Coordinate, head: Coordinate) => {
  return !(
    tail.x < head.x - 1 ||
    tail.x > head.x + 1 ||
    tail.y < head.y - 1 ||
    tail.y > head.y + 1
  );
};

const chase = (head: Coordinate, tail: Coordinate): Coordinate => {
  if (areTrouching(tail, head)) return tail;

  const dx = head.x - tail.x;
  const dy = head.y - tail.y;
  switch (`${Math.abs(dx)}${Math.abs(dy)}`) {
    case "20":
      return {
        ...tail,
        x: tail.x + Math.sign(dx),
      };
    case "02":
      return {
        ...tail,
        y: tail.y + Math.sign(dy),
      };
    case "21":
      return {
        x: tail.x + Math.sign(dx),
        y: head.y,
      };
    case "12":
      return {
        x: head.x,
        y: tail.y + Math.sign(dy),
      };
    default:
      return assertNever({ tail, head, t: areTrouching(tail, head) });
  }
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
  }
}

const advanceBoard = (board: Board, direction: Direction): Board => {
  const { head: oldHead, tail: oldTail, tailTrail: oldTailTrail } = board;

  const head = move(oldHead, direction);
  const tail = chase(head, oldTail);
  const tailTrail = [...oldTailTrail, tail];

  return { head, tail, tailTrail };
};

const countUnique = <T>(arr: T[]): number => [...new Set(arr.map(o => JSON.stringify(o)))].length;

export const directions = decode(await input_reader(import.meta.resolve));

const a = directions
  .reduce((board, dir) => advanceBoard(board, dir), newBoard())
  .tailTrail
  .thrush(countUnique);

export default a;

if (import.meta.main) {
  console.log(a);
}
