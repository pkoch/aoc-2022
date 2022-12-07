import { assertNever, input_reader } from "../libtapete.ts";
import "../langExts/Object/thrush.ts";

const zip = <U, V>(a: U[], b: V[]): [U, V?][] => a.map((k, i) => [k, b.at(i)]);

export interface MoveOrder {
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

export type CrateStacks = Record<string, string[]>;

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
    // line + " ": See the note on CRATE_LINE_RE.
    const matches = [...(line + " ").matchAll(CRATE_LINE_RE)];
    if (!matches) return assertNever(line);
    if (matches.length !== labels.length) return assertNever(line);
    for (const [l, v] of zip(labels, matches.map((m) => m.groups!.letter))) {
      if (!v) continue;
      result[l].unshift(v);
    }
  }
  return result;
};

export const decode = (s: string): {
  crateStacks: CrateStacks;
  moveOrders: MoveOrder[];
} => {
  const [crateStacksS, moveOrdersS] = s.split("\n\n", 2);
  return {
    crateStacks: decodeCrateStacks(crateStacksS),
    moveOrders: moveOrdersS.trim().split("\n").map(decodeMoveOrder),
  };
};

const applyMoveOrder = (state: CrateStacks, order: MoveOrder): CrateStacks => {
  const result: CrateStacks = JSON.parse(JSON.stringify(state));

  result[order.to] = [
    ...result[order.to],
    ...result[order.from].slice(-order.n).reverse(),
  ];
  result[order.from].splice(-order.n);

  return result;
};

export const showTops = (state: CrateStacks): string =>
  state
    .thrush(Object.values)
    .map((s) => s.at(-1)!)
    .reduce((a, b) => a + b);

const a = decode(
  await input_reader(import.meta.resolve),
)
  .thrush(({ crateStacks, moveOrders }) =>
    moveOrders.reduce(applyMoveOrder, crateStacks)
  )
  .thrush(showTops);

export default a;

if (import.meta.main) {
  console.log(a);
}
