import { filter, isDate, pipe, toArray } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = isDate(new Date());
const res2 = isDate("2024-01-01");
const res3 = pipe(new Date(), isDate);

const res4 = pipe(
  [new Date(), "2025-01-01", new Date()] as const,

  filter(isDate),

  toArray,
);

const res5 = pipe(
  [1, null, undefined, "1", {}, "2025-01-01"] as const,

  filter(isDate),

  toArray,
);

checks([
  check<typeof res1, boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, boolean, Test.Pass>(),
  check<typeof res4, Date[], Test.Pass>(),
  check<typeof res5, never[], Test.Pass>(),
]);
