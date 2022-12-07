import { add, assertNever, input_reader } from "../libtapete.ts";
import { losesTo, Play, score, winsTo } from "./1.ts";

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
