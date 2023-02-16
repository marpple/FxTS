import { pipe, toAsync, uniq } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = uniq([1, 2, 1]);
const res2 = uniq(["1", "2", "1"]);

const res3 = uniq(toAsync([1, 2, 3]));
const res4 = pipe([1, 2, 1, 4], uniq);
const res5 = pipe(toAsync([1, 2, 3, 4]), uniq);

checks([
  check<typeof res1, IterableIterator<number>, Test.Pass>(),
  check<typeof res2, IterableIterator<string>, Test.Pass>(),
  check<typeof res3, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res4, IterableIterator<number>, Test.Pass>(),
  check<typeof res5, AsyncIterableIterator<number>, Test.Pass>(),
]);
