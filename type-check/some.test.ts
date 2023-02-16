import { pipe, some, toAsync } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res0 = some((a) => a % 5 === 0, []);

const res1 = some((a) => a % 5 === 0, [1, 2, 3]);
const res2 = some((a) => a === "c", "abc");

const res1Promise = some((a) => a % 5 === 0, toAsync([1, 2, 3]));
const res2Promise = some((a) => a === "c", toAsync("abc"));

const res3 = pipe(
  [1, 2, 3],
  some((a) => a % 5 === 0),
);

const res4 = pipe(
  [1, 2, 3],
  toAsync,
  some((a) => Promise.resolve(a % 5 === 0)),
);

checks([
  check<typeof res0, false, Test.Pass>(),
  check<typeof res1, boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res1Promise, Promise<boolean>, Test.Pass>(),
  check<typeof res2Promise, Promise<boolean>, Test.Pass>(),
  check<typeof res3, boolean, Test.Pass>(),
  check<typeof res4, Promise<boolean>, Test.Pass>(),
]);
