export default async (resolve: (a: string) => string) =>
  (new TextDecoder("utf-8")).decode(
    await Deno.readFile(resolve("./input").split("://")[1]),
  );
