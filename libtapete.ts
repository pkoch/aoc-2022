export const input_reader = async (resolve: (a: string) => string) =>
  (new TextDecoder("utf-8")).decode(
    await Deno.readFile(resolve("./input").split("://")[1]),
  );

export const assertNever = (o: unknown): never => {
  console.error(o);
  throw new Error(`Expected to be unreachable.`);
};

export const add = (a: number, b: number): number => a + b;

// deno-lint-ignore no-explicit-any
export const toNumber = (o: any): number => +new Number(o);
