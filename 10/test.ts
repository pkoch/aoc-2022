import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import "../langExts/Object/thrush.ts";
import { decode, registerValues } from "./1.ts";

import a1 from "./1.ts";
// import a2 from "./2.ts";

const sample1Instructions = `
noop
addx 3
addx -5
`.trim();

Deno.test({
  name: "1/sample/1",
  fn() {
    assertEquals(
      sample1Instructions.thrush(decode).thrush(registerValues),
      [
        1,
        1,
        1,
        4,
        4,
        -1,
      ],
    );
  },
});

Deno.test({
  name: "1",
  fn() {
    assertEquals(a1, 14160);
  },
});

// Deno.test({
//   name: "2",
//   fn() {
//     assertEquals(a2, 2665);
//   },
// });
