import { drop, pipe, toAsync } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = drop(2, []);
const res2 = drop(2, [1, 2, 3, 4]);
const res3 = drop(2, toAsync([1, 2, 3, 4]));
const res4 = pipe([1, 2, 3, 4], drop(2));
const res5 = pipe(toAsync([1, 2, 3, 4]), drop(2));

checks([
  check<typeof res1, IterableIterator<never>, Test.Pass>(),
  check<typeof res2, IterableIterator<number>, Test.Pass>(),
  check<typeof res3, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res4, IterableIterator<number>, Test.Pass>(),
  check<typeof res5, AsyncIterableIterator<number>, Test.Pass>(),
]);
