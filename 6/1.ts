import { input_reader } from "../libtapete.ts";
import "../langExts/Array/windows.ts";

export const allDifferent = <T>(v: T[]): boolean =>
  [...(new Set(v)).values()].length == v.length;

const GROUP_SIZE = 4;
const a = (await input_reader(import.meta.resolve))
  .split("")
  .windows(GROUP_SIZE)
  .findIndex(allDifferent) +
  GROUP_SIZE;

export default a;

if (import.meta.main) {
  console.log(a);
}
