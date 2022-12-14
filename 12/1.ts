import { assertNever, input_reader } from "../libtapete.ts";
import "../langExts/Object/thrush.ts";

const decodeChar = (c: string) => c.charCodeAt(0)! - "a".charCodeAt(0)!;

const decodeRaw = (s: string): string[][] =>
  s.trim().split("\n").map((l) => l.trim().split(""));

export type Coord = { y: number; x: number };
const findChar = (grid: string[][], targetChar: string): Coord => {
  for (const [line, y] of grid.map((l, i): [string[], number] => [l, i])) {
    for (const [char, x] of line.map((c, i): [string, number] => [c, i])) {
      if (targetChar == char) {
        return { y, x };
      }
    }
  }
  return assertNever({ grid, targetChar });
};

type Grid = number[][];
const cantonsDecls = {
  // Grid representation to height value.
  S: "a",
  E: "z",
} as const;

type Cantons = keyof typeof cantonsDecls;
type RawBoard =
  & { grid: Grid }
  & { [K in Cantons]: Coord };

export const decode = (s: string): RawBoard => {
  const stringGrid = decodeRaw(s);
  const cantons: Record<Cantons, Coord> = cantonsDecls
    .thrush(Object.entries)
    .map(([char, _]) => [char, findChar(stringGrid, char)])
    .thrush(Object.fromEntries);

  cantons.thrush(Object.entries).forEach(([char, coord]) => {
    stringGrid[coord.y][coord.x] =
      cantonsDecls[char as keyof typeof cantonsDecls];
  });

  return {
    grid: stringGrid.map((l) => l.map(decodeChar)),
    ...cantons,
  };
};

export type Path = Coord[];

export interface Board {
  grid: Grid;
  maxY: number;
  maxX: number;
  start: Coord;
  target: Coord;
  unexplored: Path[];
  cheapestPath: Map<string, Path>;
}

export const makeBoard = (rb: RawBoard): Board => {
  return {
    grid: rb.grid,
    maxY: rb.grid.length - 1,
    maxX: rb.grid[0].length - 1,
    start: rb.S,
    target: rb.E,
    unexplored: [[rb.S]],
    cheapestPath: new Map(),
  };
};

const estimateTotalCost = (path: Path, target: Coord): number => {
  const lastCoord = path.at(-1)!;
  return path.length +
    Math.abs(lastCoord.x - target.x) +
    Math.abs(lastCoord.y - target.y);
};

const cost = (path: Path | undefined): number => {
  if (path === undefined) return Infinity;
  return path.length;
};

const heightAt = (board: Board, c: Coord): number => board.grid[c.y][c.x];

const explore = (board: Board, path: Path): Path[] => {
  const c = path.at(-1)!;
  return [
    { y: c.y - 1, x: c.x },
    { y: c.y + 1, x: c.x },
    { y: c.y, x: c.x - 1 },
    { y: c.y, x: c.x + 1 },
  ]
    .filter(({ y, x }) =>
      0 <= x && x <= board.maxX && 0 <= y && y <= board.maxY
    )
    .filter((newCoord) => heightAt(board, newCoord) - heightAt(board, c) <= 1)
    .map((coord) => [...path, coord]);
};

const coordKey = (c: Coord): string => `${c.y},${c.x}`;

export const findPath = (board: Board): Path => {
  const targetKey = coordKey(board.target);
  while (!board.cheapestPath.has(targetKey)) {
    if (!board.unexplored.length) return assertNever({ board });
    board.unexplored = board.unexplored
      .toSorted((a, b) =>
        estimateTotalCost(a, board.target) - estimateTotalCost(b, board.target)
      );

    const path = board.unexplored.shift()!;
    const newPaths = explore(board, path);
    for (const newPath of newPaths) {
      const lastCoord = newPath.at(-1)!;
      const lastCoordKey = coordKey(lastCoord);
      if (cost(newPath) < cost(board.cheapestPath.get(lastCoordKey))) {
        board.cheapestPath.set(lastCoordKey, newPath);
        board.unexplored.push(newPath);
      }
    }
  }
  return board.cheapestPath.get(targetKey)!;
};

const rawBoard = decode(await input_reader(import.meta.resolve));
const board = makeBoard(rawBoard);
const a = () => findPath(board).length - 1;

export default a;

if (import.meta.main) {
  console.log(a());
}
