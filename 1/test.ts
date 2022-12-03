import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

import a1 from "./1.ts";
import a2 from "./2.ts";

Deno.test({
  name: "check",
  fn() {
    assertEquals(a1, 68442);
    assertEquals(a2, 204837);
  },
});
