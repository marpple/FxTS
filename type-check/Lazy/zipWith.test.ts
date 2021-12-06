import * as Test from "../../src/types/Test";
import { toAsync, zipWith } from "../../src";

const { checks, check } = Test;

const iter1 = ["foo", "bar", "ha"];
const iter2 = [1, 2, 3];

const res1 = zipWith((a, b) => ({ [a]: b }), iter1, iter2);
const res2 = zipWith((a, b) => ({ [a]: b }), toAsync(iter1), iter2);
const res3 = zipWith((a, b) => ({ [a]: b }), iter1, toAsync(iter2));
const res4 = zipWith((a, b) => ({ [a]: b }), toAsync(iter1), toAsync(iter2));
const res5 = zipWith((a, b) => [a, b], iter1, iter2);
const res6 = zipWith((a, b) => [a, b] as [string, number], iter1, iter2);

checks([
  check<
    typeof res1,
    IterableIterator<{
      [x: string]: number;
    }>,
    Test.Pass
  >(),
  check<
    typeof res2,
    AsyncIterableIterator<{
      [x: string]: number;
    }>,
    Test.Pass
  >(),
  check<
    typeof res3,
    AsyncIterableIterator<{
      [x: string]: number;
    }>,
    Test.Pass
  >(),
  check<
    typeof res4,
    AsyncIterableIterator<{
      [x: string]: number;
    }>,
    Test.Pass
  >(),
  check<typeof res5, IterableIterator<(string | number)[]>, Test.Pass>(),
  check<typeof res6, IterableIterator<[string, number]>, Test.Pass>(),
]);
