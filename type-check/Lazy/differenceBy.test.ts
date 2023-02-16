import { differenceBy, toAsync } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = differenceBy((a) => a, [1, 2, 3, 4], [5, 6, 3, 4]);
const res2 = differenceBy((a) => String(a), [1, 2, 3, 4], [5, 6, 3, 4]);
const res3 = differenceBy((a) => a, toAsync([1, 2, 3, 4]), [5, 6, 3, 4]);
const res4 = differenceBy((a) => a, [1, 2, 3, 4], toAsync([5, 6, 3, 4]));
const res5 = differenceBy(
  (a) => a,
  toAsync([1, 2, 3, 4]),
  toAsync([5, 6, 3, 4]),
);

checks([
  check<typeof res1, IterableIterator<number>, Test.Pass>(),
  check<typeof res2, IterableIterator<number>, Test.Pass>(),
  check<typeof res3, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res4, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res5, AsyncIterableIterator<number>, Test.Pass>(),
]);
