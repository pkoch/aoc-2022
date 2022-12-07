import { input_reader } from "../libtapete.ts";
import "../langExts/Array/windows.ts";
import { allDifferent } from "./1.ts";

const GROUP_SIZE = 14;
const a = (await input_reader(import.meta.resolve))
  .split("")
  .windows(GROUP_SIZE)
  .findIndex(allDifferent) +
  GROUP_SIZE;

export default a;

if (import.meta.main) {
  console.log(a);
}
