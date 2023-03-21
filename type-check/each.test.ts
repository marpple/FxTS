import { each, pipe, take, toAsync } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = each(console.log, [1, 2, 3]);
const res2 = pipe([1, 2, 3], each(console.log));
const res3 = pipe([1, 2, 3], take(1), each(console.log));
const res4 = pipe([1, 2, 3], toAsync, each(console.log));

checks([
  check<typeof res1, void, Test.Pass>(),
  check<typeof res2, void, Test.Pass>(),
  check<typeof res3, void, Test.Pass>(),
  check<typeof res4, Promise<void>, Test.Pass>(),
]);
