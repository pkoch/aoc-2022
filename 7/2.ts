import { isDir, preTraverseTree, totalSize, tree } from "./1.ts";

const TOTAL_SPACE = 70000000;
const SPACE_NEEDED_FOR_UPDATE = 30000000;
const currentFreeSpace = TOTAL_SPACE - totalSize(tree);
const targetSpace = SPACE_NEEDED_FOR_UPDATE - currentFreeSpace;

const a = preTraverseTree(tree)
  .filter(isDir)
  .map(totalSize)
  .filter((s) => s >= targetSpace)
  .toSorted((a, b) => a - b)[0];

export default a;

if (import.meta.main) {
  console.log(a);
}
