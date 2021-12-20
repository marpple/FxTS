import * as Test from "../src/types/Test";
import { max, pipe, toAsync } from "../src";

const { checks, check } = Test;

const res1 = max([]);
const res2 = max([2]);
const res3 = max([1, NaN]);
const res4 = max(toAsync([1]));

// pipeline
const res5 = pipe([1, 2, 3], max);
const res6 = pipe([1, 2, 3], toAsync, max);

checks([
  check<typeof res1, number, Test.Pass>(),
  check<typeof res2, number, Test.Pass>(),
  check<typeof res3, number, Test.Pass>(),
  check<typeof res4, Promise<number>, Test.Pass>(),
  check<typeof res5, number, Test.Pass>(),
  check<typeof res6, Promise<number>, Test.Pass>(),
]);
