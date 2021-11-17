import * as Test from "../src/types/Test";
import { find, pipe, toAsync } from "../src";

const { checks, check } = Test;

const res1 = find((a) => a === 3, []);
const res2 = find((a) => a === 3, [1, 2, 3, 4, 5]);
const res3 = find((a) => a === "e", ["a", "b", "c", "d"]);

const res4 = pipe(
  [1, 2, 3, 4, 5],
  find((a) => a === 3),
);
const res5 = pipe(
  ["a", "b", "c", "d"],
  toAsync,
  find((a) => Promise.resolve(a === "e")),
);

checks([
  check<typeof res1, undefined, Test.Pass>(),
  check<typeof res2, number | undefined, Test.Pass>(),
  check<typeof res3, string | undefined, Test.Pass>(),
  check<typeof res4, number | undefined, Test.Pass>(),
  check<typeof res5, Promise<string | undefined>, Test.Pass>(),
]);
