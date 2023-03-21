import { identity, pipe, sortBy, toAsync } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res0 = sortBy(identity, []);
const res1 = sortBy(identity, [1, 2, 3]);
const res2 = sortBy(identity, "abc");
const res3 = sortBy(identity, toAsync([1, 2, 3]));
const res4 = sortBy(identity, toAsync("abc"));
const res5 = pipe([1, 2, 3], sortBy(identity));
const res6 = pipe([1, 2, 3], toAsync, sortBy(identity));

checks([
  check<typeof res0, any[], Test.Pass>(),
  check<typeof res1, number[], Test.Pass>(),
  check<typeof res2, string[], Test.Pass>(),
  check<typeof res3, Promise<number[]>, Test.Pass>(),
  check<typeof res4, Promise<string[]>, Test.Pass>(),
  check<typeof res5, number[], Test.Pass>(),
  check<typeof res6, Promise<number[]>, Test.Pass>(),
]);
