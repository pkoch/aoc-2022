import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

import a1 from "./1.ts";
import a2 from "./2.ts";

Deno.test({
  name: "1",
  fn() {
    assertEquals(a1, 1262);
  },
});

Deno.test({
  name: "2",
  fn() {
    assertEquals(a2, 3444);
  },
});
