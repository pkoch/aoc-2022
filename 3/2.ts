import { input_reader } from "../libtapete.ts";
import "../langExts/Array/chunks.ts";
import { add, intersect, priority } from "./1.ts";

const a = (await input_reader(import.meta.resolve))
  .trim()
  .split("\n")
  .chunks(3)
  .map(intersect)
  .map(priority)
  .reduce(add);

export default a;

if (import.meta.main) {
  console.log(a);
}
