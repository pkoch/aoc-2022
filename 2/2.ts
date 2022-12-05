import { assertNever, input_reader } from "../libtapete.ts";

const add = (a: number, b: number): number => a + b;

enum Play {
  Rock,
  Paper,
  Scisors,
}

const decodePlay = (str: string): Play => {
  switch (str) {
    case "A":
      return Play.Rock;
    case "B":
      return Play.Paper;
    case "C":
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

enum Order {
  Lose,
  Draw,
  Win,
}

const decodeOrder = (str: string): Order => {
  switch (str) {
    case "X":
      return Order.Lose;
    case "Y":
      return Order.Draw;
    case "Z":
      return Order.Win;
    default:
      return assertNever(str);
  }
};

const playFromOrder = (them: Play, order: Order): Play => {
  switch (order) {
    case Order.Lose:
      return losesTo.get(them)!;
    case Order.Draw:
      return them;
    case Order.Win:
      return winsTo.get(them)!;
    default:
      return assertNever(order);
  }
};

const a = (await input_reader(import.meta.resolve))
  .trim()
  .split("\n")
  .map((l): [Play, Play] => {
    const [lS, rS] = l.split(" ", 2);
    const them = decodePlay(lS);
    const ours = playFromOrder(them, decodeOrder(rS));
    return [them, ours];
  })
  .map(score)
  .reduce(add);

export default a;

if (import.meta.main) {
  console.log(a);
}
