import { min, pipe, toAsync } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = min([]);
const res2 = min([2]);
const res3 = min([1, NaN]);
const res4 = min(toAsync([1]));

// pipeline
const res5 = pipe([1, 2, 3], min);
const res6 = pipe([1, 2, 3], toAsync, min);

checks([
  check<typeof res1, number, Test.Pass>(),
  check<typeof res2, number, Test.Pass>(),
  check<typeof res3, number, Test.Pass>(),
  check<typeof res4, Promise<number>, Test.Pass>(),
  check<typeof res5, number, Test.Pass>(),
  check<typeof res6, Promise<number>, Test.Pass>(),
]);
