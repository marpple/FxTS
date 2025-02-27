import { concurrentPool, pipe, toAsync } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = concurrentPool(3, toAsync([1, 2, 3, 4]));
const res2 = pipe(toAsync([1, 2, 3, 4]), concurrentPool(3));

checks([
  check<typeof res1, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res2, AsyncIterableIterator<number>, Test.Pass>(),
]);
