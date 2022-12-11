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

// This has now turned into a math guessing game. :(
// This works because all monkeys use disibility as their test.
// So, if we think about a number in terms of its disibility, we come to the
// conclusion that all the monkey devive for their own prime numbers.
// So, if we divide by something that doesn't change the divisibility of any
// monkey, we're good. These numbers were extracted by hand from the input
// because I didn't feel like drilling down an arg to this method.
const COOLDOWN_FACTOR = [2, 3, 5, 7, 11, 13, 17, 19].reduce((a, b) => a * b);
const cooldown = (n: number): number => n % COOLDOWN_FACTOR;

const inspectItem = (
  [leftRepr, op, rightRepr]: Operation,
  item: number,
): number => {
  const [leftFn, rightFn] = [leftRepr, rightRepr].map(operandReprToFn);
  return cooldown(Operators[op](leftFn(item), rightFn(item)));
};

const isDivisible = (a: number, b: number): boolean => (a % b) == 0;
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

range(10000).forEach(() => {
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
