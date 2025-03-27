import { pipe, takeUntilInclusive, toAsync } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = takeUntilInclusive((a) => a > 2, [1, 2, 3]);
const res2 = takeUntilInclusive(async (a) => a > 2, [1, 2, 3]);
const res3 = takeUntilInclusive((a) => a > 2, toAsync([1, 2, 3]));
const res4 = takeUntilInclusive(async (a) => a > 2, toAsync([1, 2, 3]));

const res5 = pipe(
  [1, 2, 3, 4],
  takeUntilInclusive((a) => a > 2),
);
const res6 = pipe(
  [1, 2, 3, 4],
  takeUntilInclusive(async (a) => a > 2),
);
const res7 = pipe(
  toAsync([1, 2, 3, 4]),
  takeUntilInclusive((a) => a > 2),
);
const res8 = pipe(
  toAsync([1, 2, 3, 4]),
  takeUntilInclusive(async (a) => a > 2),
);

checks([
  check<typeof res1, IterableIterator<number>, Test.Pass>(),
  check<typeof res2, IterableIterator<number>, Test.Pass>(), // prettier-ignore
  check<typeof res3, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res4, AsyncIterableIterator<number>, Test.Pass>(),

  check<typeof res5, IterableIterator<number>, Test.Pass>(),
  check<typeof res6, IterableIterator<number>, Test.Pass>(), // prettier-ignore
  check<typeof res7, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res8, AsyncIterableIterator<number>, Test.Pass>(),
]);
