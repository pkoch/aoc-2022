import { input_reader } from "../libtapete.ts";
import { assertNever } from "../libtapete.ts";

declare global {
  interface String {
    splitAt: (pos: number) => string[];
  }
}

String.prototype.splitAt = function (pos: number): string[] {
  return [
    this.slice(0, pos),
    this.slice(pos, this.length),
  ];
};

const add = (a: number, b: number): number => a + b;

const intersect = (items: string[]): string =>
  [
    ...items.map((i) => new Set(i)).reduce((a, b) =>
      new Set([...a.values()].filter((n) => b.has(n)))
    ).values(),
  ].join("");

const VALID_ITEMS = /^[a-zA-Z]$/;
const priority = (c: string): number => {
  if (!c.match(VALID_ITEMS)) return assertNever(c);

  const charCode = c.charCodeAt(0);

  if ("a".charCodeAt(0) <= charCode && charCode <= "z".charCodeAt(0)) {
    return charCode - "a".charCodeAt(0) + 1;
  }
  if ("A".charCodeAt(0) <= charCode && charCode <= "Z".charCodeAt(0)) {
    return charCode - "A".charCodeAt(0) + 27;
  }

  return assertNever(charCode);
};

const a = (await input_reader(import.meta.resolve))
  .trim()
  .split("\n")
  .map((s) => s.splitAt(s.length / 2))
  .map(intersect)
  .map(priority)
  .reduce(add);

export default a;

if (import.meta.main) {
  console.log(a);
}
