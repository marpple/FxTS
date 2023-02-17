import { last, pipe, toAsync } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = last([]);
const res2 = last(["2"]);
const res3 = last([1, "2"]);

// pipeline
const res4 = pipe([1, 2, 3], last);
const res5 = pipe([1, 2, 3], toAsync, last);

// readonly tuple
const res6 = last([] as const);
const res7 = last(["2"] as const);
const res8 = last([1, "2"] as const);

checks([
  check<typeof res1, undefined, Test.Pass>(),
  check<typeof res2, string | undefined, Test.Pass>(),
  check<typeof res3, number | string | undefined, Test.Pass>(),

  check<typeof res4, number | undefined, Test.Pass>(),
  check<typeof res5, Promise<number | undefined>, Test.Pass>(),

  check<typeof res6, undefined, Test.Pass>(),
  check<typeof res7, "2", Test.Pass>(),
  check<typeof res8, "2", Test.Pass>(),
]);
