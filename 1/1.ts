import { add, input_reader, toNumber } from "../libtapete.ts";

const max = (a: number, b: number): number => a > b ? a : b;

export const decode = (s: string): number[][] =>
  s
    .trim()
    .split("\n\n")
    .map((span) => span.split("\n").map(toNumber));

const a = decode(await input_reader(import.meta.resolve))
  .map((l) => l.reduce(add))
  .reduce(max);

export default a;

if (import.meta.main) {
  console.log(a);
}
