import * as Test from "../src/types/Test";
import { sum, pipe, toAsync } from "../src";

const { checks, check } = Test;

const res0 = sum([]);
const res1 = sum([1, 2]);
const res2 = sum(toAsync([1, 2]));
const res3 = pipe([], sum);
const res4 = pipe([1, 2], sum);
const res5 = pipe([1, 2], toAsync, sum);

checks([
  check<typeof res0, number, Test.Pass>(),
  check<typeof res1, number, Test.Pass>(),
  check<typeof res2, Promise<number>, Test.Pass>(),
  check<typeof res3, number, Test.Pass>(),
  check<typeof res4, number, Test.Pass>(),
  check<typeof res5, Promise<number>, Test.Pass>(),
]);
