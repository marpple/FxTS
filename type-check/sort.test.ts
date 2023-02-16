import { pipe, sort, toAsync } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res0 = sort((a, b) => a > b, []);
const res1 = sort((a, b) => a > b, [1, 2, 3]);
const res2 = sort((a, b) => a > b, "abc");

const res3 = sort((a, b) => a > b, toAsync([1, 2, 3]));
const res4 = sort((a, b) => a > b, toAsync("abc"));

const res5 = pipe(
  [1, 2, 3],
  sort((a, b) => a > b),
);

const res6 = pipe(
  [1, 2, 3],
  toAsync,
  sort((a, b) => a > b),
);

checks([
  check<typeof res0, any[], Test.Pass>(),
  check<typeof res1, number[], Test.Pass>(),
  check<typeof res2, string[], Test.Pass>(),
  check<typeof res3, Promise<number[]>, Test.Pass>(),
  check<typeof res4, Promise<string[]>, Test.Pass>(),
  check<typeof res5, number[], Test.Pass>(),
  check<typeof res6, Promise<number[]>, Test.Pass>(),
]);
