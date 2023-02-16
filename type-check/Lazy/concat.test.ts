import { concat, pipe, toAsync } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = concat([], [4, 5, 6]);
const res2 = concat([1, 2, 3], []);

const res3 = concat([1, 2, 3], [4, 5, 6]);
const res4 = concat([1, 2, 3], ["4", "5", "6"]);

const res5 = concat([1, 2, 3], toAsync([4, 5, 6]));
const res6 = concat(toAsync([1, 2, 3]), [4, 5, 6]);
const res7 = concat(toAsync([1, 2, 3]), toAsync([4, 5, 6]));
const res8 = concat(toAsync([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]), toAsync([4, 5, 6])); // prettier-ignore

const res9 = pipe([1, 2, 3], concat([4, 5, 6]));
const res10 = pipe(toAsync([1, 2, 3]), concat([4, 5, 6]));
const res11 = pipe([1, 2, 3], concat(toAsync([4, 5, 6])));

checks([
  check<typeof res1, IterableIterator<number>, Test.Pass>(),
  check<typeof res2, IterableIterator<number>, Test.Pass>(),

  check<typeof res3, IterableIterator<number>, Test.Pass>(),
  check<typeof res4, IterableIterator<number | string>, Test.Pass>(),

  check<typeof res5, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res6, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res7, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res8, AsyncIterableIterator<number>, Test.Pass>(),

  check<typeof res9, IterableIterator<number>, Test.Pass>(),
  check<typeof res10, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res11, AsyncIterableIterator<number>, Test.Pass>(),
]);
