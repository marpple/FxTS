import * as Test from "../src/types/Test";
import { includes, pipe, toAsync } from "../src";

const { checks, check } = Test;

const res1 = includes(3, []); // false
const res2 = includes(3, [1, 2, 3, 4, 5]);
const res3 = includes("e", ["a", "b", "c", "d"]);
const res4 = includes("e", toAsync(["a", "b", "c", "d"]));

const res5 = pipe([1, 2, 3, 4, 5], includes(3));
const res6 = pipe(["a", "b", "c", "d"], toAsync, includes(3));

checks([
  check<typeof res1, false, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, boolean, Test.Pass>(),
  check<typeof res4, Promise<boolean>, Test.Pass>(),
  check<typeof res5, boolean, Test.Pass>(),
  check<typeof res6, Promise<boolean>, Test.Pass>(),
]);
