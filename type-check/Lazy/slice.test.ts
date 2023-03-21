import { pipe, slice, toAsync } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = slice(2, [1, 2, 3, 4]);
const res2 = slice(1, 2, [1, 2, 3, 4]);
const res3 = slice(2, "abcde");
const res4 = slice(1, 2, "abcde");

const res5 = slice(2, toAsync([1, 2, 3, 4]));
const res6 = slice(1, 2, toAsync([1, 2, 3, 4]));

const res7 = pipe([1, 2, 3, 4, 5, 6, 7], slice(2));
const res8 = pipe([1, 2, 3, 4, 5, 6, 7], slice(2));

const res9 = pipe([1, 2, 3, 4, 5, 6, 7], slice(2, 3));
const res10 = pipe([1, 2, 3, 4, 5, 6, 7], slice(2, 3));

const res11 = pipe([1, 2, 3, 4, 5, 6, 7], toAsync, slice(2));
const res12 = pipe([1, 2, 3, 4, 5, 6, 7], toAsync, slice(2));

const res13 = pipe([1, 2, 3, 4, 5, 6, 7], toAsync, slice(2, 3));
const res14 = pipe([1, 2, 3, 4, 5, 6, 7], toAsync, slice(2, 3));

checks([
  check<typeof res1, IterableIterator<number>, Test.Pass>(),
  check<typeof res2, IterableIterator<number>, Test.Pass>(),

  check<typeof res3, IterableIterator<string>, Test.Pass>(),
  check<typeof res4, IterableIterator<string>, Test.Pass>(),

  check<typeof res5, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res6, AsyncIterableIterator<number>, Test.Pass>(),

  check<typeof res7, IterableIterator<number>, Test.Pass>(),
  check<typeof res8, IterableIterator<number>, Test.Pass>(),

  check<typeof res9, IterableIterator<number>, Test.Pass>(),
  check<typeof res10, IterableIterator<number>, Test.Pass>(),

  check<typeof res11, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res12, AsyncIterableIterator<number>, Test.Pass>(),

  check<typeof res13, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res14, AsyncIterableIterator<number>, Test.Pass>(),
]);
