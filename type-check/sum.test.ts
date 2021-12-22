import * as Test from "../src/types/Test";
import { sum, pipe, toAsync } from "../src";

const { checks, check } = Test;

const res1 = sum([1, 2]);
const res2 = sum(["a", "b"]);
const res3 = sum(toAsync([1, 2]));
const res4 = pipe([1, 2], sum);
const res5 = pipe(["a", "b"], sum);
const res6 = pipe([1, 2], toAsync, sum);
const res7 = pipe(["a", "b"], toAsync, sum);

checks([
  check<typeof res1, number, Test.Pass>(),
  check<typeof res2, string, Test.Pass>(),
  check<typeof res3, Promise<number>, Test.Pass>(),
  check<typeof res4, number, Test.Pass>(),
  check<typeof res5, string, Test.Pass>(),
  check<typeof res6, Promise<number>, Test.Pass>(),
  check<typeof res7, Promise<string>, Test.Pass>(),
]);
