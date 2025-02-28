import { filter, isDate, pipe, toArray } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = isDate(1);
const res2 = isDate(new Date());

const res3 = pipe(
  [new Date(), "2024-01-01", null, new Date(2024, 0, 1)] as const,

  filter(isDate),

  toArray,
);

const res4 = pipe(
  ["2024-01-01", null, 123] as const,

  filter(isDate),

  toArray,
);

checks([
  check<typeof res1, boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, Date[], Test.Pass>(),
  check<typeof res4, never[], Test.Pass>(),
]);
