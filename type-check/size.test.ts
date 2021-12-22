import * as Test from "../src/types/Test";
import { size, pipe, toAsync } from "../src";

const { checks, check } = Test;

const res1 = size([]);
const res2 = size([1, 2, 3, 4, 5]);
const res3 = size(["a", "b", "c", "d"]);
const res4 = size(toAsync(["a", "b", "c", "d"]));
const res5 = pipe([1, 2, 3, 4, 5], size);
const res6 = pipe(["a", "b", "c", "d"], toAsync, size);

checks([
  check<typeof res1, number, Test.Pass>(),
  check<typeof res2, number, Test.Pass>(),
  check<typeof res3, number, Test.Pass>(),
  check<typeof res4, Promise<number>, Test.Pass>(),
  check<typeof res5, number, Test.Pass>(),
  check<typeof res6, Promise<number>, Test.Pass>(),
]);
