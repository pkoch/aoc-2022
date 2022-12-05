export const input_reader = async (resolve: (a: string) => string) =>
  (new TextDecoder("utf-8")).decode(
    await Deno.readFile(resolve("./input").split("://")[1]),
  );

export const assertNever = (o: unknown): never => {
  throw new Error(`Expected to be unreachable, got ${JSON.stringify(o)}`);
};
