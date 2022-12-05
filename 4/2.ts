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

interface RangePair {
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

const overlaps = (rp: RangePair): boolean => {
  return rp.left.upper >= rp.right.lower && rp.right.upper >= rp.left.lower;
};

const a = (await input_reader(import.meta.resolve))
  .trim()
  .split("\n")
  .map(decodeRangePair)
  .filter(overlaps)
  .length;

export default a;

if (import.meta.main) {
  console.log(a);
}
