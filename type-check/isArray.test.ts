import { isArray, negate, pipe, throwIf } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = isArray([1, 2, 3]);
const res2 = isArray("a");

const res3 = pipe(
  [1, 2, 3] as const,

  throwIf(negate(isArray)),
);

const res4 = pipe(
  [1, 2, 3],

  throwIf(negate(isArray)),
);

checks([
  check<typeof res1, boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, readonly [1, 2, 3], Test.Pass>(),
  check<typeof res4, number[], Test.Pass>(),
]);
