import { consume, pipe, toAsync } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = consume([1, 2, 3]);
const res2 = pipe([1, 2, 3], consume);
const res3 = pipe([1, 2, 3], (res) => consume(res, 2));
const res4 = pipe([1, 2, 3], toAsync, consume);

checks([
  check<typeof res1, void, Test.Pass>(),
  check<typeof res2, void, Test.Pass>(),
  check<typeof res3, void, Test.Pass>(),
  check<typeof res4, Promise<void>, Test.Pass>(),
]);
