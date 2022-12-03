export const assertNever = (o: unknown): never => {
  throw new Error(`Expected to be unreachable, got ${o}`);
};
