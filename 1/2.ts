import { add, input_reader } from "../libtapete.ts";
import { decode } from "./1.ts";

const a = decode(await input_reader(import.meta.resolve))
  .map((l) => l.reduce(add))
  .sort()
  .slice(-3)
  .reduce(add);

export default a;

if (import.meta.main) {
  console.log(a);
}
