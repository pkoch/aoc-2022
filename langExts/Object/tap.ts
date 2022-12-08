declare global {
  interface Object {
    tap: <T, U>(this: T, f: (o: T) => U) => T;
  }
}

function tap<T, U>(this: T, f: (o: T) => U) {
  void f(this);
  return this;
}

Object.prototype.tap = tap;
