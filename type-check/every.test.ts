import { every, pipe, toAsync } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res0 = every((a) => a % 3 === 0, []);
const res1 = every((a) => a % 3 === 0, [3, 6, 9]);
const res2 = pipe(
  [3, 6, 9],
  every((a) => a % 3 === 0),
);
const res3 = pipe(
  [3, 6, 9],
  toAsync,
  every((a) => Promise.resolve(a % 3 === 0)),
);

checks([
  check<typeof res0, true, Test.Pass>(),
  check<typeof res1, boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, Promise<boolean>, Test.Pass>(),
]);
