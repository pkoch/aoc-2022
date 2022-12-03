import ir from "../input_reader.ts";
import { assertNever } from "../under_the_carpet.ts";

const add = (a: number, b: number): number => a + b;

enum Play {
  Rock,
  Paper,
  Scisors,
}

const losesTo = new Map<Play, Play>();
losesTo.set(Play.Rock, Play.Paper);
losesTo.set(Play.Paper, Play.Scisors);
losesTo.set(Play.Scisors, Play.Rock);

const decode = (str: string): Play => {
  switch (str) {
    case "A":
      return Play.Rock;
    case "B":
      return Play.Paper;
    case "C":
      return Play.Scisors;
    case "X":
      return Play.Rock;
    case "Y":
      return Play.Paper;
    case "Z":
      return Play.Scisors;
    default:
      return assertNever(str);
  }
};

const score = ([them, ours]: [Play, Play]): number => {
  return scoreCombo([them, ours]) + scoreOurHand(ours);
};

const scoreCombo = ([them, ours]: [Play, Play]): number => {
  if (them == ours) return 3;
  if (losesTo.get(ours) == them) return 0;
  return 6;
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
  .map((l) => l.split(" ").map((a) => decode(a)) as [Play, Play])
  .map(score)
  .reduce(add);

export default a;

if (import.meta.main) {
  console.log(JSON.stringify(a, null, 2));
}
// 11475
