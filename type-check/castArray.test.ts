import { castArray } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const num = 1 as number;
const numOrArr = [1, 2, 3] as number | number[];

const res1 = castArray(num);
const res2 = castArray([1, 2, 3]);
const res3 = castArray("a" as string);
const res4 = castArray(null);
const res5 = castArray(undefined);
const res6 = castArray({ a: 1 });
const res7 = castArray(numOrArr);

checks([
  check<typeof res1, number[], Test.Pass>(),
  check<typeof res2, number[], Test.Pass>(),
  check<typeof res3, string[], Test.Pass>(),
  check<typeof res4, null[], Test.Pass>(),
  check<typeof res5, undefined[], Test.Pass>(),
  check<typeof res6, { a: number }[], Test.Pass>(),
  check<typeof res7, number[], Test.Pass>(),
]);
