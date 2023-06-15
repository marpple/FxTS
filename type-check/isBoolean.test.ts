import { filter, isBoolean, pipe, toArray } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = isBoolean(true);
const res2 = isBoolean("a");
const res3 = pipe(true, isBoolean);

const res4 = pipe([true, 1, true, 2] as const, filter(isBoolean), toArray);
const res5 = pipe([1, 2] as const, filter(isBoolean), toArray);

checks([
  check<typeof res1, boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, boolean, Test.Pass>(),
  check<typeof res4, true[], Test.Pass>(),
  check<typeof res5, never[], Test.Pass>(),
]);
