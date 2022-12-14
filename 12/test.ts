import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import "../langExts/Array/enumerate.ts";
import { assertNever } from "../libtapete.ts";

import a1, { Board, Coord, decode, findPath, makeBoard, Path } from "./1.ts";
import a2 from "./2.ts";

const exampleInput = `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`.trim();

const examplePicture = `
v..v<<<<
>v.vv<<^
.>vv>E^^
..v>>>^^
..>>>>>^
`.trim();

const paintPair = (a: Coord, b: Coord): string => {
  switch (`${a.x - b.x},${a.y - b.y}`) {
    case `-1,0`:
      return ">";
    case `1,0`:
      return "<";
    case `0,-1`:
      return "v";
    case `0,1`:
      return "^";
    default:
      return assertNever({ a, b });
  }
};
const paint = (board: Board, path: Path): string => {
  const result: string[][] = [];

  for (const line of board.grid) {
    result.push([]);
    for (const _ of line) {
      result.at(-1)!.push(".");
    }
  }

  for (const [c, i] of path.slice(0, -1).enumerate()) {
    result[c.y][c.x] = paintPair(c, path[i + 1]);
  }

  result[board.target.y][board.target.x] = "E";

  return result.map((l) => l.join("")).join("\n");
};

Deno.test({
  name: "1/example",
  fn() {
    const board = makeBoard(decode(exampleInput));
    const path = findPath(board);
    assertEquals(paint(board, path), examplePicture);
    assertEquals(path.length - 1, 31);
  },
});

Deno.test({
  name: "1",
  fn() {
    assertEquals(a1(), 520);
  },
});

Deno.test({
  name: "2",
  fn() {
    assertEquals(a2(), 508);
  },
});
