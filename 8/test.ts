import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

import a1, { Cell, countVisibles, decode, visibilities, visible } from "./1.ts";
import a2, { sceneries } from "./2.ts";

const sampleInput = decode(`
30373
25512
65332
33549
35390
`.trim());

const samplePicture = `
11111
11101
11011
10101
11111
`.trim();

const paint = (board: Cell<boolean>[][]): string =>
  board
    .map((l) =>
      l
        .map(visible)
        .map((b) => b ? "1" : "0")
        .join("")
    ).join("\n");

Deno.test({
  name: "sample/1/picture",
  fn() {
    assertEquals(
      paint(visibilities(sampleInput)),
      samplePicture,
    );
  },
});
Deno.test({
  name: "sample/1/answer",
  fn() {
    assertEquals(
      countVisibles(visibilities(sampleInput)),
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

Deno.test({
  name: "sample/2/countSightings/top line",
  fn() {
    assertEquals(
      sceneries(sampleInput).at(0)!.map((c) => c.left),
      [0, 1, 2, 3, 1],
    );
  },
});

Deno.test({
  name: "2",
  fn() {
    assertEquals(a2, 268464);
  },
});
