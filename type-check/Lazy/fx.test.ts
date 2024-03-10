import { fx, toAsync } from "../../src";
import type Cast from "../../src/types/Cast";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = fx([1, 2, 3]);
const res2 = fx([1, 2, 3])
  .map((a) => a)
  .toArray();
const res3 = fx([1, 2, 3])
  .map((a) => String(a))
  .toArray();
const res4 = fx([1, 2, 3])
  .map((a) => String(a))
  .join("");

const res5 = fx([1, 2, 3]).toAsync();
const res6 = fx(toAsync([1, 2, 3]));
const res7 = fx(toAsync([1, 2, 3]))
  .map((a) => a)
  .toArray();

checks([
  check<typeof res1, Cast<Iterable<number>, typeof res1>, Test.Pass>(),
  check<typeof res2, number[], Test.Pass>(),
  check<typeof res3, string[], Test.Pass>(),
  check<typeof res4, string, Test.Pass>(),
  check<typeof res5, Cast<AsyncIterable<number>, typeof res5>, Test.Pass>(),
  check<typeof res6, Cast<AsyncIterable<number>, typeof res5>, Test.Pass>(),
  check<typeof res7, Promise<number[]>, Test.Pass>(),
]);
