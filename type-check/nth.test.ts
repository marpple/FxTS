import * as Test from "../src/types/Test";
import { nth, pipe, toAsync } from "../src";

const { checks, check } = Test;

const res1 = nth(3, []);
const res2 = nth(3, [1, 2, 3, 4, 5]);
const res3 = nth(3, ["a", "b", "c", "d"]);
const res4 = nth(3, toAsync(["a", "b", "c", "d"]));

const res5 = pipe([1, 2, 3, 4, 5], nth(3));
const res6 = pipe(["a", "b", "c", "d"], toAsync, nth(3));

checks([
  check<typeof res1, undefined, Test.Pass>(),
  check<typeof res2, number | undefined, Test.Pass>(),
  check<typeof res3, string | undefined, Test.Pass>(),
  check<typeof res4, Promise<string | undefined>, Test.Pass>(),
  check<typeof res5, number | undefined, Test.Pass>(),
  check<typeof res6, Promise<string | undefined>, Test.Pass>(),
]);
