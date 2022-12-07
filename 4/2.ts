import { input_reader } from "../libtapete.ts";
import { decode, RangePair } from "./1.ts";

const overlaps = (rp: RangePair): boolean => {
  return rp.left.upper >= rp.right.lower && rp.right.upper >= rp.left.lower;
};

const a = decode(await input_reader(import.meta.resolve))
  .filter(overlaps)
  .length;

export default a;

if (import.meta.main) {
  console.log(a);
}
