import { assertNever, input_reader } from "../libtapete.ts";

declare global {
  interface Array<T> {
    chunks: (size: number) => T[][];
  }
}

Array.prototype.chunks = function <U>(this: U[], size: number): U[][] {
  const result: U[][] = [];

  for (let i = 0, l = this.length; i < l; i += size) {
    result.push(this.slice(i, i + size));
  }

  return result;
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
  .chunks(3)
  .map(intersect)
  .map(priority)
  .reduce(add);

export default a;

if (import.meta.main) {
  console.log(a);
}
