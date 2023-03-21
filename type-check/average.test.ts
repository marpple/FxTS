import { average, pipe, toAsync } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = average([1, 2, 3]);
const res2 = average(toAsync([1, 2, 3]));
const res3 = pipe([1, 2, 3], average);
const res4 = pipe([1, 2, 3], toAsync, average);

checks([
  check<typeof res1, number, Test.Pass>(),
  check<typeof res2, Promise<number>, Test.Pass>(),
  check<typeof res3, number, Test.Pass>(),
  check<typeof res4, Promise<number>, Test.Pass>(),
]);
