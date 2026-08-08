import { pipe, toArray, toAsync, windowed } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = windowed(2, [1, 2, 3]);
const res2 = windowed(2, toAsync([1, 2, 3]));
const res3 = pipe([1, 2, 3], windowed(2), toArray);
const res4 = pipe(toAsync([1, 2, 3]), windowed(2), toArray);

checks([
  check<typeof res1, IterableIterator<number[]>, Test.Pass>(),
  check<typeof res2, AsyncIterableIterator<number[]>, Test.Pass>(),
  check<typeof res3, number[][], Test.Pass>(),
  check<typeof res4, Promise<number[][]>, Test.Pass>(),
]);
