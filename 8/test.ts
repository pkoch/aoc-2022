import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

import a1, { Cell, countVisibles, decode, visible } from "./1.ts";
// import a2 from "./2.ts";

const sampleInput = `
30373
25512
65332
33549
35390
`.trim();

const samplePicture = `
11111
11101
11011
10101
11111
`.trim();

const paint = (board: Cell[][]): string =>
  board.map((l) => l.map(visible).map((b) => b ? "1" : "0").join("")).join(
    "\n",
  );

Deno.test({
  name: "sample/picture",
  fn() {
    assertEquals(
      paint(decode(sampleInput)),
      samplePicture,
    );
  },
});
Deno.test({
  name: "sample/1/answer",
  fn() {
    assertEquals(
      countVisibles(decode(sampleInput)),
      21,
    );
  },
});

Deno.test({
  name: "1",
  fn() {
    assertEquals(a1, 1713);
  },
});

// Deno.test({
//   name: "2",
//   fn() {
//     assertEquals(a2, 9608311);
//   },
// });
