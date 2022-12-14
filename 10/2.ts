import { instructions, registerValues } from "./1.ts";
import "../langExts/Array/chunks.ts";
import "../langExts/Array/enumerate.ts";

export const Pixels = [
  ".",
  "#",
] as const;

export type Pixel = typeof Pixels[number];

const inSprite = (spriteOffset: number, screenPixel: number): boolean =>
  spriteOffset <= screenPixel && screenPixel <= spriteOffset + 2;

const paint = ([spriteOffset, screenPixel]: [number, number]): string =>
  Pixels[+!!inSprite(spriteOffset, screenPixel)] as string;

const a = registerValues(instructions)
  .slice(0, -1)
  .chunks(40)
  .map((l) => l.enumerate(1).map(paint).join(""))
  .join("\n");

export default a;

if (import.meta.main) {
  console.log(a);
}
