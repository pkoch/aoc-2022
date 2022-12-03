import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

import a1 from "./1.ts";

Deno.test({
  name: "1",
  fn() {
    assertEquals(a1, 7889);
  },
});
