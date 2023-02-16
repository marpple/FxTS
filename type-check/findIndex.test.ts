import { findIndex, pipe, toAsync } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = findIndex((a) => a === 3, []);
const res2 = findIndex((a) => a === 3, [1, 2, 3, 4, 5]);
const res3 = findIndex((a) => a === 7, [1, 2, 3, 4, 5]);
const res4 = findIndex((a) => a === "e", ["a", "b", "c", "d"]);

const res5 = pipe(
  [1, 2, 3, 4, 5],
  findIndex((a) => a === 3),
);
const res6 = pipe(
  ["a", "b", "c", "d"],
  toAsync,
  findIndex((a) => Promise.resolve(a === "e")),
);

checks([
  check<typeof res1, -1, Test.Pass>(),
  check<typeof res2, number, Test.Pass>(),
  check<typeof res3, number, Test.Pass>(),
  check<typeof res4, number, Test.Pass>(),
  check<typeof res5, number, Test.Pass>(),
  check<typeof res6, Promise<number>, Test.Pass>(),
]);
