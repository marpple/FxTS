import { compress, pipe, toAsync } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = compress([], []);
const res2 = compress([true, false], [1, 0]);
const res3 = compress([true, false], "ab");
const res4 = compress([true, 0], [1, 0]);
const res5 = compress([true, false], toAsync([1, 0]));
const res6 = pipe([1, 0], compress([true, false]));
const res7 = pipe(Promise.resolve([1, 2, 3]), compress([true, false]));
const res8 = pipe(toAsync([1, 2, 3]), compress([true, false]));

checks([
  check<typeof res1, IterableIterator<never>, Test.Pass>(),
  check<typeof res2, IterableIterator<number>, Test.Pass>(),
  check<typeof res3, IterableIterator<string>, Test.Pass>(),
  check<typeof res4, IterableIterator<number>, Test.Pass>(),
  check<typeof res5, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res6, IterableIterator<number>, Test.Pass>(),
  check<typeof res7, Promise<IterableIterator<number>>, Test.Pass>(),
  check<typeof res8, AsyncIterableIterator<number>, Test.Pass>(),
]);
