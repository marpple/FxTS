import * as Test from "../src/types/Test";
import { toAsync, join, pipe } from "../src";

const { checks, check } = Test;

const res1 = join("-", []);
const res2 = join("!", [1, 2, 3, 4]);
const res3 = join("*", toAsync([1, 2, 3, 4]));
const res4 = pipe([1, 2, 3, 4], join("-"));
const res5 = pipe(toAsync([1, 2, 3, 4]), join("#"));

checks([
  check<typeof res1, string, Test.Pass>(),
  check<typeof res2, string, Test.Pass>(),
  check<typeof res3, Promise<string>, Test.Pass>(),
  check<typeof res4, string, Test.Pass>(),
  check<typeof res5, Promise<string>, Test.Pass>(),
]);
