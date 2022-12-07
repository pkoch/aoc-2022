declare global {
  interface Array<T> {
    all: (fn: (t: T) => boolean) => boolean;
  }
}

Array.prototype.all = function <T>(this: T[], fn: (t: T) => boolean): boolean {
  for (const el of this) {
    if (!fn(el)) return false;
  }
  return true;
};
