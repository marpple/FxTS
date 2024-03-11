import { fork, pipe } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = fork([1, 2, 3]);
const res2 = fork("abc");

const res3 = pipe([1, 2, 3], fork);
const res4 = pipe("abc", fork);

checks([
  check<typeof res1, IterableIterator<number>, Test.Pass>(),
  check<typeof res2, IterableIterator<string>, Test.Pass>(),
  check<typeof res3, IterableIterator<number>, Test.Pass>(),
  check<typeof res4, IterableIterator<string>, Test.Pass>(),
]);
