declare global {
  interface Array<T> {
    enumerate: (start?: number) => [T, number][];
  }
}

Array.prototype.enumerate = function <T>(this: T[], start = 0): [T, number][] {
  return this.map((a, i) => [a, start + i]);
};
