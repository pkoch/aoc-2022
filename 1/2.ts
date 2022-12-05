import { input_reader } from "../libtapete.ts";

const add = (a: number, b: number): number => a + b;

const a = (await input_reader(import.meta.resolve))
  .trim()
  .split("\n\n")
  .map((span) => span.split("\n").map((l) => +new Number(l)))
  .map((l) => l.reduce(add))
  .sort()
  .slice(-3)
  .reduce(add);

export default a;

if (import.meta.main) {
  console.log(a);
}
