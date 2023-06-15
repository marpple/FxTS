import { filter, isString, pipe, toArray } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = isString(1);
const res2 = isString("a");

const res3 = pipe(
  ["1", "2", "3", 4, 5, null] as const,

  filter(isString),

  toArray,
);

const res4 = pipe(
  [4, 5, null] as const,

  filter(isString),

  toArray,
);

checks([
  check<typeof res1, boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, ("1" | "2" | "3")[], Test.Pass>(),
  check<typeof res4, never[], Test.Pass>(),
]);
