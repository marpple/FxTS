import { filter, isNull, pipe, toArray } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = isNull(undefined);
const res2 = isNull(null);
const res3 = isNull(3);
const res4 = pipe([1, null, 2], filter(isNull), toArray);
const res5 = pipe([1, 2, 3], filter(isNull), toArray);

checks([
  check<typeof res1, boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, boolean, Test.Pass>(),
  check<typeof res4, null[], Test.Pass>(),
  check<typeof res5, never[], Test.Pass>(),
]);
