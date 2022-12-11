import "../langExts/Object/thrush.ts";
import { crochet } from "../libtapete.ts";
import {
  chase,
  Coordinate,
  countUniqueTailPositions,
  Direction,
  move,
} from "./1.ts";

interface Board {
  knots: Coordinate[];
  tailTrail: Coordinate[];
}

const newBoard = (): Board => {
  return {
    knots: new Array(10).fill(null).map(() => ({ x: 0, y: 0 })),
    tailTrail: [],
  };
};

const advanceBoard = (board: Board, direction: Direction): Board => {
  const { knots: oldKnots, tailTrail: oldTailTrail } = board;

  const lure = move(oldKnots[0], direction, 2);
  const knots = crochet(oldKnots, chase, lure).slice(1);
  const tailTrail = [...oldTailTrail, knots.at(-1)!];

  return { knots, tailTrail };
};

const a = countUniqueTailPositions(advanceBoard, newBoard);

export default a;

if (import.meta.main) {
  console.log(a);
}
