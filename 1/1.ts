import { input_reader } from "../libtapete.ts";

const add = (a: number, b: number): number => a + b;
const max = (a: number, b: number): number => a > b ? a : b;

const a = (await input_reader(import.meta.resolve))
  .trim()
  .split("\n\n")
  .map((span) => span.split("\n").map((l) => +new Number(l)))
  .map((l) => l.reduce(add))
  .reduce(max);

export default a;

if (import.meta.main) {
  console.log(a);
}
