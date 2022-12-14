export const input_reader = async (
  resolve: (a: string) => string,
  nameSuffix = "",
) =>
  (new TextDecoder("utf-8")).decode(
    await Deno.readFile(resolve(`./input${nameSuffix}`).split("://")[1]),
  );

export const assertNever = (o: unknown): never => {
  console.error(o);
  throw new Error(`Expected to be unreachable.`);
};

export const zip = <T>(...arrays: T[][]): T[][] => {
  const result: T[][] = [];
  for (const arr of arrays) {
    for (const [i, element] of arr.entries()) {
      if (!result[i]) result[i] = [];
      result[i].push(element);
    }
  }
  return result;
};

export const transpose = <T>(a: T[][]): T[][] => {
  return zip(...a);
};

export const add = (a: number, b: number): number => a + b;

// deno-lint-ignore no-explicit-any
export const toNumber = (o: any): number => +new Number(o);

export const notUndefined = <T>(a: T | undefined): T => {
  if (a === undefined) return assertNever(a);
  return a;
};

export const crochet = <T>(arr: T[], f: (a: T, b: T) => T, initial: T): T[] => {
  const result = [initial];
  for (const obj of arr) {
    result.push(f(result.at(-1)!, obj));
  }
  return result;
};

export const range = (n: number): number[] => {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(i);
  }
  return result;
};
