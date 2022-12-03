export default (new TextDecoder("utf-8")).decode(
  await Deno.readFile(import.meta.resolve("./input").split("://")[1]),
);
