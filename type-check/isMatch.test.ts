import { isMatch } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = isMatch({ a: 1, b: 2 }, { a: 1 });
const res2 = isMatch({ a: 1 }, { a: 1, b: 2 });
const res3 = isMatch({ user: { name: "John" } }, { user: { name: "John" } });
const res4 = isMatch([1, 2, 3], [1, 2, 3]);
const res5 = isMatch(new Date("2024-01-01"), new Date("2024-01-01"));
const res6 = isMatch(/abc/gi, /abc/gi);
const res7 = isMatch({ a: 1 }, {});
const res8 = isMatch(null, { a: 1 });
const res9 = isMatch({ a: 1 }, null);

const res10 = isMatch(new Map([["a", 1]]), new Map([["a", 1]]));

const res11 = isMatch(new Set([1, 2, 3]), new Set([1, 2, 3]));

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
  check<typeof res10, boolean, Test.Pass>(),
  check<typeof res11, boolean, Test.Pass>(),
]);
