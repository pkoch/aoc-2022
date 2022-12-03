import ir from "../input_reader.ts";
import { assertNever } from "../under_the_carpet.ts";

const add = (a: number, b: number): number => a + b;

enum Play {
  Rock,
  Paper,
  Scisors,
}

const decode = (str: string): Play => {
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

const losesTo = new Map<Play, Play>([
  [Play.Paper, Play.Rock],
  [Play.Scisors, Play.Paper],
  [Play.Rock, Play.Scisors],
]);

const flip = <A, B>([k, v]: [A, B]): [B, A] => [v, k];

const winsTo = new Map<Play, Play>([...losesTo.entries()].map(flip));

const score = ([them, ours]: [Play, Play]): number => {
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

const a = (await ir(import.meta.resolve))
  .trim()
  .split("\n")
  .map((l) => {
    const a = l.split(" ");
    switch (a.length) {
      case 2:
        return [decode(a[0]), decode(a[1])] as [Play, Play];
      default:
        return assertNever(a);
    }
  })
  .map(score)
  .reduce(add);

export default a;

if (import.meta.main) {
  console.log(JSON.stringify(a, null, 2));
}
