import ir from "../input_reader.ts";

const a = (await ir(import.meta.resolve))
  .trim()
  .split("\n\n")
  .map((span) => span.split("\n").map((l) => Number.parseInt(l)))
  .filter((a) => a.length)
  .map((l) => l.reduce((acc, n) => acc + n, 0))
  .reduce((acc, n) => n < acc ? acc : n, 0);

export default a;

if (import.meta.main) {
  console.log(JSON.stringify(a, null, 2));
}
