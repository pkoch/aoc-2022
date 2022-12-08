import { add, assertNever, input_reader, toNumber } from "../libtapete.ts";
import "../langExts/String/splitAt.ts";

interface LsDir {
  name: string;
}
interface LsFile {
  size: number;
  name: string;
}
type LsEntry = LsDir | LsFile;

const decodeLsEntry = (s: string): LsEntry => {
  const [left, name] = s.split(" ");

  if (left == "dir") return { name };

  return { name, size: toNumber(left) };
};

interface Cd {
  cd: string;
}
interface Ls {
  ls: LsEntry[];
}
type Command = Cd | Ls;

const decodeComamnd = (s: string): Command => {
  const [prefix, contents] = s.splitAt(3);

  switch (prefix) {
    case "ls\n":
      return { ls: contents.split("\n").map(decodeLsEntry) };
    case "cd ":
      return { cd: contents };
    default:
      return assertNever(s);
  }
};

export const decode = (s: string): Command[] => {
  const commandsS = s.split("\n$ ");

  if (commandsS.shift() != "$ cd /") throw new Error();

  return commandsS.map(decodeComamnd);
};

interface File {
  parent: Dir;
  name: string;

  size: number;
}
interface Dir {
  parent: Dir;
  name: string;

  entries: DirEntry[];
}
type DirEntry = File | Dir;

const lsEntryToDirEntry = (parent: Dir, ls: LsEntry): DirEntry => {
  if ("size" in ls) return { ...ls, parent };
  return { ...ls, parent, entries: [] };
};

const makeTree = (curr: Dir, command: Command): Dir => {
  if ("cd" in command) {
    const { cd: targetName } = command;
    if (targetName == "..") return curr.parent;

    const target = curr.entries.find((e) => e.name == targetName)!;
    if ("size" in target) return assertNever({ target, curr });

    return target;
  }

  if ("ls" in command) {
    curr.entries = command.ls.map((ls) => lsEntryToDirEntry(curr, ls));

    return curr;
  }

  return assertNever({ curr, command });
};

export const makeRootDir = (): Dir => {
  // deno-lint-ignore no-explicit-any
  const result: any = { name: "/", entries: [] };
  result.parent = result;
  return result;
};

const getRoot = (d: Dir): Dir => {
  if (d.parent === d) return d;
  return getRoot(d.parent);
};

export function preTraverseTree(d: DirEntry): DirEntry[] {
  if ("size" in d) return [d];

  return [d as DirEntry].concat(d.entries.flatMap(preTraverseTree));
}

// deno-lint-ignore no-explicit-any
export const isDir = (o: any): o is Dir =>
  "parent" in o &&
  "name" in o &&
  "entries" in o;

// deno-lint-ignore no-explicit-any
const isFile = (o: any): o is File =>
  "parent" in o &&
  "name" in o &&
  "size" in o;

export const totalSize = (d: Dir): number =>
  preTraverseTree(d)
    .filter(isFile)
    .map((f) => f.size)
    .reduce(add);

const input_contents = await input_reader(import.meta.resolve);
const commands = decode(input_contents);

export const tree = getRoot(commands.reduce(makeTree, makeRootDir()));

const TARGET_SIZE = 100000;
const a = preTraverseTree(tree)
  .filter(isDir)
  .map(totalSize)
  .filter((s) => s <= TARGET_SIZE)
  .reduce(add);

export default a;

if (import.meta.main) {
  console.log(a);
}
