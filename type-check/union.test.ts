import { pipe, toArray, toAsync, union } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = union([1, 2], [2, 3]);
const res2 = union(toAsync([1, 2]), [2, 3]);
const res3 = union([1, 2], toAsync([2, 3]));
const res4 = pipe([2, 3], union([1, 2]), toArray);
const res5 = pipe(toAsync([2, 3]), union([1, 2]), toArray);

checks([
  check<typeof res1, IterableIterator<number>, Test.Pass>(),
  check<typeof res2, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res3, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res4, number[], Test.Pass>(),
  check<typeof res5, Promise<number[]>, Test.Pass>(),
]);
