import { intersection, pipe, toArray, toAsync } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = intersection([1, 2, 3, 4], [5, 6, 3, 4]);
const res2 = intersection(toAsync([1, 2, 3, 4]), [5, 6, 3, 4]);
const res3 = intersection([1, 2, 3, 4], toAsync([5, 6, 3, 4]));
const res4 = intersection(toAsync([1, 2, 3, 4]), toAsync([5, 6, 3, 4]));
const res5 = pipe([1, 2, 3, 4], intersection([5, 6, 7, 8]), toArray);
const res6 = pipe([1, 2, 3, 4], intersection("abcd"), toArray);

checks([
  check<typeof res1, IterableIterator<number>, Test.Pass>(),
  check<typeof res2, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res3, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res4, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res5, number[], Test.Pass>(),
  check<typeof res6, number[], Test.Pass>(),
]);
