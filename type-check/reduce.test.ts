import * as Test from "../src/types/Test";
import { reduce } from "../src";

const { checks, check } = Test;

const res1 = reduce((a, b) => a + b, []);
const res2 = reduce((a, b) => a + b, "seed", []);
const res3 = reduce((a, b) => a + b, 0, [1, 2, 3]);
const res4 = reduce((a, b) => a + b, [1, 2, 3]);
const res5 = reduce((a, b) => a + b, "0", [1, 2, 3]);
const res6 = reduce((a: string, b) => String(Number(a) + Number(b)), [1, 2, 3]);

// const res7 = reduce((a, b) => a + b, Promise.resolve(0), [1, 2, 3]); // error
// const res8 = reduce((a, b) => Promise.resolve(a + b), 0, [1, 2, 3]); // error

checks([
  check<typeof res1, undefined, Test.Pass>(),
  check<typeof res2, "seed", Test.Pass>(),
  check<typeof res3, number, Test.Pass>(),
  check<typeof res4, number, Test.Pass>(),
  check<typeof res5, string, Test.Pass>(),
  check<typeof res6, string, Test.Pass>(),
]);
