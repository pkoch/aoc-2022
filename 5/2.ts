import { input_reader } from "../libtapete.ts";
import { CrateStacks, decode, MoveOrder, showTops } from "./1.ts";

const applyMoveOrder = (state: CrateStacks, order: MoveOrder): CrateStacks => {
  const result: CrateStacks = JSON.parse(JSON.stringify(state));

  result[order.to] = [
    ...result[order.to],
    ...result[order.from].slice(-order.n),
  ];
  result[order.from].splice(-order.n);

  return result;
};

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
