import { input_reader } from "../libtapete.ts";

interface Range {
  // Inclusive on both sides.
  lower: number;
  upper: number;
}

const decodeRange = (s: string): Range => {
  const a = s.split("-", 2).map((n) => +new Number(n));
  return {
    lower: a[0],
    upper: a[1],
  };
};

export interface RangePair {
  left: Range;
  right: Range;
}

const decodeRangePair = (s: string): RangePair => {
  const a = s.split(",", 2).map(decodeRange);
  return {
    left: a[0],
    right: a[1],
  };
};

const fullyContain = (ra: Range, rb: Range): boolean => {
  return ra.lower <= rb.lower && rb.upper <= ra.upper;
};

const oneRangeFullyContainsTheOther = (rp: RangePair): boolean => {
  return fullyContain(rp.left, rp.right) || fullyContain(rp.right, rp.left);
};

export const decode = (s: string): RangePair[] =>
  s
    .trim()
    .split("\n")
    .map(decodeRangePair);

const a = decode(await input_reader(import.meta.resolve))
  .filter(oneRangeFullyContainsTheOther)
  .length;

export default a;

if (import.meta.main) {
  console.log(a);
}
