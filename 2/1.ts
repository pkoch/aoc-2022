import { assertNever, input_reader } from "../libtapete.ts";

export const add = (a: number, b: number): number => a + b;

export enum Play {
  Rock,
  Paper,
  Scisors,
}

const decodePlay = (str: string): Play => {
  switch (str) {
    case "A":
    case "X":
      return Play.Rock;
    case "B":
    case "Y":
      return Play.Paper;
    case "C":
    case "Z":
      return Play.Scisors;
    default:
      return assertNever(str);
  }
};

export const losesTo = new Map<Play, Play>([
  [Play.Paper, Play.Rock],
  [Play.Scisors, Play.Paper],
  [Play.Rock, Play.Scisors],
]);

const flip = <A, B>([k, v]: [A, B]): [B, A] => [v, k];

export const winsTo = new Map<Play, Play>([...losesTo.entries()].map(flip));

export const score = ([them, ours]: [Play, Play]): number => {
  return scoreCombo([them, ours]) + scoreOurHand(ours);
};

const scoreCombo = ([them, ours]: [Play, Play]): number => {
  if (them == ours) return 3;
  if (winsTo.get(ours) == them) return 0;
  if (losesTo.get(ours) == them) return 6;

  return assertNever([them, ours]);
};

const scoreOurHand = (ours: Play): number => {
  switch (ours) {
    case Play.Rock:
      return 1;
    case Play.Paper:
      return 2;
    case Play.Scisors:
      return 3;
    default:
      return assertNever(ours);
  }
};

const a = (await input_reader(import.meta.resolve))
  .trim()
  .split("\n")
  .map((l): [Play, Play] => {
    const [lS, rS] = l.split(" ", 2);
    return [decodePlay(lS), decodePlay(rS)];
  })
  .map(score)
  .reduce(add);

export default a;

if (import.meta.main) {
  console.log(a);
}
