import { merge, pipe } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = merge({ a: 1 }, { b: "x" });
const res2 = merge({ a: 1, b: { c: 2 } }, { b: { d: 3 } });
const res3 = pipe({ a: 1 }, merge({ b: "x" }));

checks([
  check<typeof res1, { a: number } & { b: string }, Test.Pass>(),
  check<
    typeof res2,
    { a: number; b: { c: number } } & { b: { d: number } },
    Test.Pass
  >(),
  check<typeof res3, { b: string } & { a: number }, Test.Pass>(),
]);
