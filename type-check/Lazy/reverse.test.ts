import * as Test from "../../src/types/Test";
import { reverse, pipe, toAsync } from "../../src";

const { checks, check } = Test;

const res1 = reverse([]);
const res2 = reverse([1, 2, 3, 4]);
const res3 = reverse("abcd");
const res4 = reverse(toAsync([1, 2, 3, 4]));
const res5 = reverse(toAsync("abcd"));
const res6 = pipe([], reverse);
const res7 = pipe(toAsync([1, 2, 3, 4]), reverse);
const res8 = pipe(toAsync("abcd"), reverse);

checks([
  check<typeof res1, IterableIterator<never>, Test.Pass>(),
  check<typeof res2, IterableIterator<number>, Test.Pass>(),
  check<typeof res3, IterableIterator<string>, Test.Pass>(),
  check<typeof res4, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res5, AsyncIterableIterator<string>, Test.Pass>(),
  check<typeof res6, IterableIterator<never>, Test.Pass>(),
  check<typeof res7, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res8, AsyncIterableIterator<string>, Test.Pass>(),
]);
