import * as Test from "../../src/types/Test";
import { chunk, toAsync, pipe } from "../../src";

const { checks, check } = Test;

const res1 = chunk(1, []);
const res2 = chunk(1, [1, 2, 3]);
const res3 = chunk(1, toAsync([1, 2, 3]));

const res4 = pipe([1, 2, 3, 4], chunk(1));
const res5 = pipe(Promise.resolve([1, 2, 3, 4]), chunk(1));
const res6 = pipe(toAsync([1, 2, 3, 4]), chunk(1));

checks([
  check<typeof res1, IterableIterator<never[]>, Test.Pass>(),

  check<typeof res2, IterableIterator<number[]>, Test.Pass>(),
  check<typeof res3, AsyncIterableIterator<number[]>, Test.Pass>(),

  check<typeof res4, IterableIterator<number[]>, Test.Pass>(),
  check<typeof res5, Promise<IterableIterator<number[]>>, Test.Pass>(),
  check<typeof res6, AsyncIterableIterator<number[]>, Test.Pass>(),
]);
