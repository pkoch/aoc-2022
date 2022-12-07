import { add, assertNever, input_reader } from "../libtapete.ts";
import "../langExts/String/splitAt.ts";
import "../langExts/Array/all.ts";

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

  return {
    size: +new Number(left),
    name,
  };
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

  if (commandsS[0] != "$ cd /") throw new Error(commandsS[0]);
  commandsS.shift();

  return commandsS.map(decodeComamnd);
};

interface InFlightFile {
  parent: DiscoveredDir;
  name: string;

  size: number;
}
interface UnexploredDir {
  parent: DiscoveredDir;
  name: string;

  entries: undefined;
}
interface UnexploredRoot {
  parent: UnexploredRoot;
  name: string;

  entries: undefined;
}
interface DiscoveredDir {
  parent: DiscoveredDir;
  name: string;

  entries: InFlightEntry[];
}
type InFlightDir = DiscoveredDir | UnexploredDir | UnexploredRoot;
type InFlightEntry = InFlightDir | InFlightFile;

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

export const makeRootDir = (): UnexploredRoot => {
  // deno-lint-ignore no-explicit-any
  const result: any = { name: "/", entries: undefined };
  result.parent = result;
  return result;
};

const makeTree = (curr: InFlightDir, command: Command): InFlightDir => {
  if ("cd" in command) {
    const { cd: targetName } = command;
    if (targetName == "..") {
      if (curr.parent == curr) {
        return assertNever({ reason: "Can't traverse up from root.", curr });
      }
      return curr.parent;
    }

    if (!curr.entries) {
      return assertNever({
        reason: "Can't cd down on an unexplored dir",
        curr,
        command,
      });
    }
    const target = curr.entries.find((e) => e.name == targetName);

    if (!target) return assertNever({ target, curr });
    if ("size" in target) return assertNever({ target, curr });
    return target;
  }
  if ("ls" in command) {
    if (curr.entries) {
      return assertNever({
        reason: "Surprising ls on an explored dir",
        curr,
        command,
      });
    }

    // We're about to turn curr from an UnexploredDir to a DiscoveredDir.
    // Having this const makes it simpler for type checking, but they're the
    // same on purpose, since we want to mutate in-place (as opposed to
    // rebuilding the tree).
    const newCurr: DiscoveredDir = curr as unknown as DiscoveredDir;

    newCurr.entries = command.ls.map((e: LsEntry): InFlightEntry => {
      // Same typing trick.
      const newE = e as unknown as InFlightEntry;

      newE.parent = newCurr;
      if (!("size" in newE)) newE.entries = undefined;

      return newE;
    });

    return newCurr;
  }

  return assertNever({ curr, command });
};

const getRoot = <T extends Dir | InFlightDir>(d: T): T => {
  if (d.parent === d) return d;
  return getRoot(d.parent as T);
};

export function preTraverseTree(d: DirEntry): DirEntry[] {
  if ("size" in d) return [d];

  return [d as DirEntry].concat(d.entries.flatMap(preTraverseTree));
}

// deno-lint-ignore no-explicit-any
export const isDir = (o: any): o is Dir =>
  "parent" in o &&
  "name" in o &&
  "entries" in o &&
  o.entries;

// deno-lint-ignore no-explicit-any
const isFile = (o: any): o is File =>
  "parent" in o &&
  "name" in o &&
  "size" in o;

function assertNotInFlightAnymore(e: InFlightFile): File;
function assertNotInFlightAnymore(e: InFlightDir): Dir;
function assertNotInFlightAnymore(e: InFlightEntry): DirEntry {
  // Files are never quite in flight.
  if ("size" in e) return e as File;

  // Dirs need the entries to be there, and for all of them to also not be in flight.
  if (
    e.entries && e.entries.all((e) => {
      // Thanks, Typescript. 🤦
      if ("size" in e) return !!assertNotInFlightAnymore(e);
      return !!assertNotInFlightAnymore(e);
    })
  ) {
    return e as Dir;
  }

  return assertNever(e);
}

export const totalSize = (d: Dir): number =>
  preTraverseTree(d).filter(isFile).map((f) => f.size).reduce(add);

const input_contents = await input_reader(import.meta.resolve);
const commands = decode(input_contents);
export const tree = assertNotInFlightAnymore(
  getRoot(commands.reduce(makeTree, makeRootDir())),
);

const TARGET_SIZE = 100000;
const a = preTraverseTree(tree).filter(isDir).map(totalSize).filter((s) =>
  s <= TARGET_SIZE
).reduce(add);

export default a;

if (import.meta.main) {
  console.log(a);
}
