import { filter, isNumber, pipe, toArray } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = isNumber(1);
const res2 = isNumber("a");
const res3 = pipe(1, isNumber);

const res4 = pipe(
  [1, 2, "", null, 3] as const,

  filter(isNumber),

  toArray,
);

const res5 = pipe(
  [null, undefined],

  filter(isNumber),

  toArray,
);

checks([
  check<typeof res1, boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, boolean, Test.Pass>(),
  check<typeof res4, (1 | 2 | 3)[], Test.Pass>(),
  check<typeof res5, never[], Test.Pass>(),
]);
