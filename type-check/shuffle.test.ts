import { pipe, shuffle, toAsync } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = shuffle([1, 2, 3, 4, 5]);
const res2 = shuffle("hello");
const res3 = shuffle(toAsync([1, 2, 3, 4, 5]));
const res4 = shuffle(toAsync("hello"));

checks([
  check<typeof res1, number[], Test.Pass>(),
  check<typeof res2, string[], Test.Pass>(),
  check<typeof res3, Promise<number[]>, Test.Pass>(),
  check<typeof res4, Promise<string[]>, Test.Pass>(),
]);

// Test curried version
const shuffleCurried = shuffle();
const res5 = shuffleCurried([1, 2, 3]);

checks([check<typeof res5, number[], Test.Pass>()]);

// Test in pipe
const res8 = pipe([1, 2, 3, 4, 5], shuffle);

checks([check<typeof res8, number[], Test.Pass>()]);

// Test empty array
const res11 = shuffle([]);
checks([check<typeof res11, any[], Test.Pass>()]);
