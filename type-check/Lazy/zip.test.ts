import { fx, pipe, toAsync, zip } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = zip([1, 2, 3], "abc", [true, false, true]);
const res2 = zip([1, 2, 3], "abcde", [true, false, true]);
const res3 = zip([1, 2, 3], toAsync("abc"), [true, false, true]);

const res4 = pipe([1, 2, 3], zip("abc"));
const res5 = pipe([1, 2, 3], toAsync, zip("abc"));
const res6 = pipe([1, 2, 3], zip(toAsync("abc")));
const res7 = fx([1, 2, 3]).zip(["a", "b", "c"]).toArray();
const res8 = fx([1, 2, 3]).toAsync().zip(["a", "b", "c"]).toArray();

checks([
  check<typeof res1, IterableIterator<[number, string, boolean]>, Test.Pass>(),
  check<typeof res2, IterableIterator<[number, string, boolean]>, Test.Pass>(),
  check<
    typeof res3,
    AsyncIterableIterator<[number, string, boolean]>,
    Test.Pass
  >(),
  check<typeof res4, IterableIterator<[string, number]>, Test.Pass>(),
  check<typeof res5, AsyncIterableIterator<[string, number]>, Test.Pass>(),
  check<typeof res6, AsyncIterableIterator<[string, number]>, Test.Pass>(),
  check<typeof res7, [string, number][], Test.Pass>(),
  check<typeof res8, Promise<[string, number][]>, Test.Pass>(),
]);
