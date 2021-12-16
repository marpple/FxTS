import * as Test from "../../src/types/Test";
import { pipe, cycle, toAsync, range } from "../../src";

const { checks, check } = Test;

const res1 = cycle([1, 2, 3, 4]);
const res2 = cycle("abc");

const res3 = cycle(toAsync(range(3)));
const res4 = cycle(toAsync("abc"));

const res5 = pipe(range(3), cycle);
const res6 = pipe(range(3), toAsync, cycle);

checks([
  check<typeof res1, IterableIterator<number>, Test.Pass>(),
  check<typeof res2, IterableIterator<string>, Test.Pass>(),
  check<typeof res3, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res4, AsyncIterableIterator<string>, Test.Pass>(),
  check<typeof res5, IterableIterator<number>, Test.Pass>(),
  check<typeof res6, AsyncIterableIterator<number>, Test.Pass>(),
]);
