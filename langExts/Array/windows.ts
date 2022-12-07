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
