import { pipe, toAsync, zipWithIndex } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = zipWithIndex("abcde");
const res2 = zipWithIndex([1, 2, 3, 4, 5] as const);

const res3 = pipe([1, 2, 3, 4, 5], zipWithIndex);
const res4 = pipe([1, 2, 3, 4, 5], toAsync, zipWithIndex);

checks([
  check<typeof res1, IterableIterator<[number, string]>, Test.Pass>(),
  check<
    typeof res2,
    IterableIterator<[number, 1 | 2 | 3 | 4 | 5]>,
    Test.Pass
  >(),
  check<typeof res3, IterableIterator<[number, number]>, Test.Pass>(),
  check<typeof res4, AsyncIterableIterator<[number, number]>, Test.Pass>(),
]);
