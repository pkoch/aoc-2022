declare global {
  interface Array<T> {
    chunks: (size: number) => T[][];
  }
}

Array.prototype.chunks = function <U>(this: U[], size: number): U[][] {
  const result: U[][] = [];

  for (let i = 0, l = this.length; i < l; i += size) {
    result.push(this.slice(i, i + size));
  }

  return result;
};
