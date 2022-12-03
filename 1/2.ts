import input from "./input.ts";

const a = input
  .trim()
  .split("\n\n")
  .map((span) => span.split("\n").map((l) => Number.parseInt(l)))
  .filter((a) => a.length)
  .map((l) => l.reduce((acc, n) => acc + n, 0))
  .sort()
  .slice(-3)
  .reduce((acc, n) => acc + n, 0);

console.log(JSON.stringify(a, null, 2));
