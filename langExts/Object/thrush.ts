declare global {
  interface Object {
    thrush: <T, U>(this: T, fn: (self: T) => U) => U;
  }
}

Object.prototype.thrush = function <T, U>(this: T, fn: (self: T) => U): U {
  return fn(this);
};
