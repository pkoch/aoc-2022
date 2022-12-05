import ir from "../input_reader.ts";
import { assertNever } from "../under_the_carpet.ts";

const lastOr = <V>(arr: V[], fallback: V): V => {
  return arr.length ? arr.slice(-1)[0] : fallback;
};

const zip = <U, V>(a: U[], b: V[]): [U, V][] => a.map((k, i) => [k, b[i]]);

interface MoveOrder {
  n: number;
  from: string;
  to: string;
}

const MOVE_ORDER_RE = /move (\d+) from (\w+) to (\w+)/;
const decodeMoveOrder = (s: string): MoveOrder => {
  const match = s.match(MOVE_ORDER_RE);
  if (!match) return assertNever(s);

  return {
    n: +new Number(match[1]),
    from: match[2],
    to: match[3],
  };
};

type CrateStacks = Record<string, string[]>;

// This regexp assume that all places are followed with a space. This is mostly
// true, as that's the separator. However, that's not true for the last column.
// So, in order to use this regexp for extracting crates from lines, we need to
// add a space at the end of line to make up for the absence of a separator.
//
// deno-lint-ignore no-regex-spaces
const CRATE_LINE_RE = /(?:\[(?<letter>[A-Z])\] )|(?:    )/g;

const decodeCrateStacks = (s: string): CrateStacks => {
  const lines = s.split("\n");
  const labels = lines.pop()!.split("").filter((s) => s !== " ");

  const result: CrateStacks = Object.fromEntries(labels.map((l) => [l, []]));
  for (const line of lines) {
    // line + ' ': See the note on CRATE_LINE_RE.
    const matches = [...(line + ' ').matchAll(CRATE_LINE_RE)];
    if(!matches) return assertNever(line);
    for(const [l, v] of zip(labels, matches.map(m => m.groups!.letter))){
      if(!v) continue;
      result[l].unshift(v);
    }
  }
  return result;
};

const decode = (s: string): {
  crateStacks: CrateStacks;
  moveOrders: MoveOrder[];
} => {
  const [crateStacksS, moveOrdersS] = s.split("\n\n", 2);
  return {
    crateStacks: decodeCrateStacks(crateStacksS),
    moveOrders: moveOrdersS.split("\n").filter(l => l.length).map(decodeMoveOrder),
  };
};

const applyMoveOrder = (state: CrateStacks, order: MoveOrder): CrateStacks => {
  const result: CrateStacks = JSON.parse(JSON.stringify(state))
  for(let i = 0; i < order.n; i++){
    result[order.to].push(result[order.from].pop()!)
  }
  return result
};

const { crateStacks, moveOrders } = decode(await ir(import.meta.resolve));

const endState = moveOrders.reduce(applyMoveOrder, crateStacks);

const a = Object.values(endState)
  .map((s) => lastOr(s, " "))
  .reduce((a, b) => a + b);

export default a;

if (import.meta.main) {
  console.log(JSON.stringify(a, null, 2));
}
