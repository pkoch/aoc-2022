import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

import a1 from "./1.ts";

Deno.test({
  name: "check",
  fn() {
    assertEquals(a1, 11475);
  },
});
