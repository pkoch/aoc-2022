import ir from "../input_reader.ts";
import { assertNever } from "../under_the_carpet.ts";

const add = (a: number, b: number): number => a + b;

interface Range {
  // Inclusive on both sides.
  lower: number;
  upper: number;
}

const decodeRange = (s: string): Range => {
  const a = s.split('-');
  switch(a.length){
    case 2:
      return {
        lower: parseInt(a[0]),
        upper: parseInt(a[1]),
      }
    default:
      return assertNever(a)
  }
}

interface RangePair {
  left: Range;
  right: Range;
}

const decodeRangePair = (s: string): RangePair => {
  const a = s.split(',');
  switch(a.length){
    case 2:
      return {
        left: decodeRange(a[0]),
        right: decodeRange(a[1]),
      }
    default:
      return assertNever(a)
  }
}

const dontOverlap = (rp: RangePair): boolean => {
  return rp.left.upper < rp.right.lower || rp.right.upper < rp.left.lower
}

const a = (await ir(import.meta.resolve))
  .trim()
  .split("\n")
  .map(decodeRangePair)
  .map(dontOverlap)
  .map(v => +!v)
  .reduce(add);

export default a;

if (import.meta.main) {
  console.log(JSON.stringify(a, null, 2));
}
