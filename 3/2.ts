import ir from "../input_reader.ts";
import { assertNever } from "../under_the_carpet.ts";

declare global {
  interface Array<T> {
    chunks: (size: number) => T[][];
  }
}

Array.prototype.chunks = function<U>(this: U[], size: number) : U[][] {
  const result: U[][] = [];

  for (let i = 0, l = this.length; i < l; i += size) {
    result.push(this.slice(i, i + size));
  }

  return result;
}

const add = (a: number, b: number): number => a + b;

const intersect = <U>(a: Set<U>, b: Set<U>): Set<U> =>
  new Set([...a.values()].filter((n) => b.has(n)))
;

const VALID_ITEMS = /[a-zA-Z]/
const priority = (s: string): number => {
  const c = s[0];
  if(c.length != 1) {
    throw new Error(`Can only know the priority of a letter, got ${c}`);
  }
  if(!VALID_ITEMS.test(c)){
    throw new Error(`Letter must match ${VALID_ITEMS}, got ${c}`);
  }

  const charCode = c.charCodeAt(0);

  if('a'.charCodeAt(0) <= charCode && charCode <= 'z'.charCodeAt(0)) {
    return charCode - 'a'.charCodeAt(0) + 1;
  }
  if('A'.charCodeAt(0) <= charCode && charCode <= 'Z'.charCodeAt(0)) {
    return charCode - 'A'.charCodeAt(0) + 27;
  }

  return assertNever(charCode);
}

const a = (await ir(import.meta.resolve))
  .trim()
  .split("\n")
  .chunks(3)
  .map((ss) => [...ss.map((s) => new Set(s)).reduce(intersect).values()][0])
  .map(priority)
  .reduce(add);

export default a;

if (import.meta.main) {
  console.log(a);
}
