import { pipe, prepend, toAsync } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = prepend(1, [1, 2, 3]);
const res2 = prepend(Promise.resolve(1), toAsync([1, 2, 3]));

const res3 = pipe([1, 2, 3, 4], prepend(3));
const res4 = pipe(Promise.resolve([1, 2, 3, 4]), prepend(3));
const res5 = pipe(toAsync([1, 2, 3, 4]), prepend(3));

checks([
  check<typeof res1, IterableIterator<number>, Test.Pass>(),
  check<typeof res2, AsyncIterableIterator<number>, Test.Pass>(),

  check<typeof res3, IterableIterator<number>, Test.Pass>(),
  check<typeof res4, Promise<IterableIterator<number>>, Test.Pass>(),
  check<typeof res5, AsyncIterableIterator<number>, Test.Pass>(),
]);
