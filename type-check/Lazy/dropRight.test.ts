import * as Test from "../../src/types/Test";
import { toAsync, dropRight, pipe } from "../../src";

const { checks, check } = Test;

const res1 = dropRight(2, []);
const res2 = dropRight(2, [1, 2, 3, 4]);
const res3 = dropRight(2, "abcd");
const res4 = dropRight(2, toAsync([1, 2, 3, 4]));
const res5 = pipe([1, 2, 3, 4], dropRight(2));
const res6 = pipe(toAsync([1, 2, 3, 4]), dropRight(2));

checks([
  check<typeof res1, IterableIterator<never>, Test.Pass>(),
  check<typeof res2, IterableIterator<number>, Test.Pass>(),
  check<typeof res3, IterableIterator<string>, Test.Pass>(),
  check<typeof res4, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res5, IterableIterator<number>, Test.Pass>(),
  check<typeof res6, AsyncIterableIterator<number>, Test.Pass>(),
]);
