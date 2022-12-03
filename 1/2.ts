const contents = (new TextDecoder("utf-8")).decode(
  await Deno.readFile("./input"),
);

const a = contents
  .split("\n\n")
  .map((span) => span.split("\n").map((l) => Number.parseInt(l) || 0))
  .filter((a) => a.length)
  .map((l) => l.reduce((acc, n) => acc + n, 0))
  .sort()
  .slice(-3)
  .reduce((acc, n) => acc + n, 0)

console.log(JSON.stringify(a, null, 2));
