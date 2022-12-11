import { add, input_reader, range } from "../libtapete.ts";

type OperandRepr = number | "old";
type Operand = (n: number) => number;
const Operators = {
  "+": add,
  "-": (a: number, b: number) => a - b,
  "*": (a: number, b: number) => a * b,
} as const;

type Operator = keyof typeof Operators;
type Operation = [OperandRepr, Operator, OperandRepr];

interface Monkey {
  items: number[];
  inspectedItems: number;
  operation: Operation;
  testDivision: number;
  nextOn: { true: number; false: number };
}

const operandReprToFn = (opRepr: OperandRepr): Operand => {
  if (opRepr == "old") return (old) => old;
  return (_old) => opRepr;
};

const cooldown = (n: number): number => Math.floor(n / 3);

const inspectItem = (
  [leftRepr, op, rightRepr]: Operation,
  item: number,
): number => {
  const [leftFn, rightFn] = [leftRepr, rightRepr].map(operandReprToFn);
  return cooldown(Operators[op](leftFn(item), rightFn(item)));
};

const isDivisible = (a: number, b: number): boolean => ((a / b) % 1) == 0;
const boolStr = (s: boolean): "true" | "false" =>
  s.toString() as "true" | "false";

const processItem = (monkeys: Monkey[], monkey: Monkey, item: number): void => {
  const newWorry = inspectItem(monkey.operation, item);
  monkey.inspectedItems++;
  const targetMonkeyIndex =
    monkey.nextOn[boolStr(isDivisible(newWorry, monkey.testDivision))];
  monkeys[targetMonkeyIndex].items.push(newWorry);
};

const turn = (monkeys: Monkey[], monkey: Monkey) => {
  while (monkey.items.length) {
    processItem(monkeys, monkey, monkey.items.shift()!);
  }
};

const round = (monkeys: Monkey[]) => {
  for (const monkey of monkeys) {
    turn(monkeys, monkey);
  }
};

const input = (await input_reader(import.meta.resolve, ".1"));
const monkeys = JSON.parse(input) as Monkey[];

range(20).forEach(() => {
  round(monkeys);
});

const a = monkeys
  .map((m) => m.inspectedItems)
  .sort((a: number, b: number) => a - b)
  .slice(-2)
  .reduce((a, b) => a * b);

export default a;

if (import.meta.main) {
  console.log(a);
}
