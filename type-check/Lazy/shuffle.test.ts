import { pipe, toArray, toAsync } from "../../src";
import shuffle from "../../src/Lazy/shuffle";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

// Test basic shuffle
const res1 = shuffle([1, 2, 3, 4, 5]);
const res2 = shuffle("hello");
const res3 = shuffle(toAsync([1, 2, 3, 4, 5]));
const res4 = shuffle(toAsync("hello"));

checks([
  check<typeof res1, IterableIterator<number>, Test.Pass>(),
  check<typeof res2, IterableIterator<string>, Test.Pass>(),
  check<typeof res3, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res4, AsyncIterableIterator<string>, Test.Pass>(),
]);

// Test in pipe with toArray
const res5 = pipe([1, 2, 3, 4, 5], shuffle, toArray);
const res6 = pipe("hello", shuffle, toArray);
const res7 = pipe(toAsync([1, 2, 3, 4, 5]), shuffle, toArray);

checks([
  check<typeof res5, number[], Test.Pass>(),
  check<typeof res6, string[], Test.Pass>(),
  check<typeof res7, Promise<number[]>, Test.Pass>(),
]);

// Test empty array
const res8 = shuffle([]);
checks([check<typeof res8, IterableIterator<never>, Test.Pass>()]);
