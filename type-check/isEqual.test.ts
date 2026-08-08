import { isEqual } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = isEqual(1, 1);
const res2 = isEqual({ a: 1 }, { a: 1 });
const res3 = isEqual([1, 2, 3], [1, 2, 3]);
const res4 = isEqual(new Date(), new Date());
const res5 = isEqual(/abc/gi, /abc/gi);
const res6 = isEqual(new Map([["a", 1]]), new Map([["a", 1]]));
const res7 = isEqual(new Set([1, 2, 3]), new Set([1, 2, 3]));
const res8 = isEqual(null, undefined);
const res9 = isEqual(NaN, NaN);

checks([
  check<typeof res1, boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, boolean, Test.Pass>(),
  check<typeof res4, boolean, Test.Pass>(),
  check<typeof res5, boolean, Test.Pass>(),
  check<typeof res6, boolean, Test.Pass>(),
  check<typeof res7, boolean, Test.Pass>(),
  check<typeof res8, boolean, Test.Pass>(),
  check<typeof res9, boolean, Test.Pass>(),
]);
