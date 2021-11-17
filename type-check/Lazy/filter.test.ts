import * as Test from "../../src/types/Test";
import { toAsync, filter, pipe } from "../../src";

const { checks, check } = Test;

const res1 = filter((a) => a % 2 === 0, []);
const res2 = filter((a) => a % 2 === 0, [1, 2, 3]);
const res3 = filter(async (a) => a % 2 === 0, [1, 2, 3]);
const res4 = filter((a) => a % 2 === 0, toAsync([1, 2, 3]));
const res5 = filter(async (a) => a % 2 === 0, toAsync([1, 2, 3]));

const res6 = pipe(
  [1, 2, 3, 4],
  filter((a) => a % 2 === 0),
);
const res7 = pipe(
  [1, 2, 3, 4],
  filter(async (a) => a % 2 === 0),
);
const res8 = pipe(
  toAsync([1, 2, 3, 4]),
  filter((a) => a % 2 === 0),
);
const res9 = pipe(
  toAsync([1, 2, 3, 4]),
  filter(async (a) => a % 2 === 0),
);

checks([
  check<typeof res1, IterableIterator<never>, Test.Pass>(),
  check<typeof res2, IterableIterator<number>, Test.Pass>(),
  check<typeof res3, IterableIterator<number>, Test.Pass>(),
  check<typeof res4, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res5, AsyncIterableIterator<number>, Test.Pass>(),

  check<typeof res6, IterableIterator<number>, Test.Pass>(),
  check<typeof res7, IterableIterator<number>, Test.Pass>(),
  check<typeof res8, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res9, AsyncIterableIterator<number>, Test.Pass>(),
]);
