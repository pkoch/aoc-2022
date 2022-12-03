import ir from "../input_reader.ts";
import { assertNever } from "../under_the_carpet.ts";

const add = (a: number, b: number): number => a + b;

const intersect = <U>(a: Set<U>, b: Set<U>): Set<U> =>
  new Set([...a.values()].filter((n) => b.has(n)))
;

class Rucksack {
  left: string[];
  right: string[];

  constructor(left: string[], right: string[]) {
    this.left = left;
    this.right = right;

    if(this.commonItem().length == 0){
      throw new Error(`No common elements: ${JSON.stringify({left, right})}`)
    }
  }

  commonItem(): string {
    return [...intersect(new Set(this.left), new Set(this.right)).values()][0];
  }

  static build(str: string): Rucksack {
    if(str.length % 2 != 0) {
      throw new Error(`Odd number of elements: ${str}`);
    }

    const left = str.slice(0, str.length / 2).split('');
    const right = str.slice(str.length / 2, str.length).split('');

    return new Rucksack(left, right);
  }
}

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
  .map(Rucksack.build)
  .map((r) => r.commonItem())
  .map(priority)
  .reduce(add);

export default a;

if (import.meta.main) {
  console.log(JSON.stringify(a, null, 2));
}
