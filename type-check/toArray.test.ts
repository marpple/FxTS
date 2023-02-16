import { pipe, toArray, toAsync } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

function* range(n: number) {
  let i = -1;
  while (++i < n) {
    yield i;
  }
}

const res1 = toArray(range(3));
const res2 = toArray("abc");

const res1Promise = toArray(toAsync(range(3)));
const res2Promise = toArray(toAsync("abc"));

const res3 = pipe(range(3), toArray);
const res3Promise = pipe(range(3), toAsync, toArray);

checks([
  check<typeof res1, number[], Test.Pass>(),
  check<typeof res2, string[], Test.Pass>(),
  check<typeof res1Promise, Promise<number[]>, Test.Pass>(),
  check<typeof res2Promise, Promise<string[]>, Test.Pass>(),
  check<typeof res2Promise, Promise<string[]>, Test.Pass>(),
  check<typeof res3, number[], Test.Pass>(),
  check<typeof res3Promise, Promise<number[]>, Test.Pass>(),
]);
