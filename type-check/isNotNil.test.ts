import { filter, isNotNil, pipe, toArray } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = isNotNil(1);
const res2 = isNotNil(null);
const res3 = isNotNil(undefined);

const res4 = pipe(
  [1, null, 2, undefined, 3],

  filter(isNotNil),

  toArray,
);

function getValue(input?: string | null) {
  if (isNotNil(input)) {
    return input;
  }
  return "";
}

checks([
  check<typeof res1, boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, boolean, Test.Pass>(),
  check<typeof res4, number[], Test.Pass>(),
  check<ReturnType<typeof getValue>, string, Test.Pass>(),
]);
