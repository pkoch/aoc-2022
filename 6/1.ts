import { input_reader } from "../libtapete.ts";

declare global {
  interface Array<T> {
    windows: (size: number) => T[][];
  }
}

Array.prototype.windows = function <T>(this: T[], size: number): T[][] {
  return Array.from(
    { length: this.length - size + 1 },
    (_, i) => this.slice(i, i + size),
  );
};

const allDifferent = <T>(v: T[]): boolean =>
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
