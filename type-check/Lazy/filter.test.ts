import * as Test from "../../src/types/Test";
import { toAsync, filter, pipe } from "../../src";

const { checks, check } = Test;

const res1 = filter((a) => a % 2 === 0, []);
const res2 = filter((a) => a % 2 === 0, [1, 2, 3]);
const res3 = filter(async (a) => a % 2 === 0, [1, 2, 3]);
const res4 = filter(Boolean, [undefined, null, 0, "", false, -0, 123] as const);
const res5 = filter((a) => a % 2 === 0, toAsync([1, 2, 3]));
const res6 = filter(async (a) => a % 2 === 0, toAsync([1, 2, 3]));
const res7 = filter(
  Boolean,
  toAsync([undefined, null, 0, "", false, -0, 123] as const),
);

const res8 = pipe(
  [1, 2, 3, 4],
  filter((a) => a % 2 === 0),
);
const res9 = pipe(
  [1, 2, 3, 4],
  filter(async (a) => a % 2 === 0),
);
const res10 = pipe(
  [undefined, null, 0, "", false, -0, 123] as const,
  filter(Boolean),
);
const res11 = pipe(
  toAsync([1, 2, 3, 4]),
  filter((a) => a % 2 === 0),
);
const res12 = pipe(
  toAsync([1, 2, 3, 4]),
  filter(async (a) => a % 2 === 0),
);
const res13 = pipe(
  toAsync([undefined, null, 0, "", false, -0, 123] as const),
  filter(Boolean),
);

checks([
  check<typeof res1, IterableIterator<never>, Test.Pass>(),
  check<typeof res2, IterableIterator<number>, Test.Pass>(),
  check<typeof res3, IterableIterator<number>, Test.Pass>(),
  check<typeof res4, IterableIterator<123>, Test.Pass>(),
  check<typeof res5, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res6, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res7, AsyncIterableIterator<123>, Test.Pass>(),

  check<typeof res8, IterableIterator<number>, Test.Pass>(),
  check<typeof res9, IterableIterator<number>, Test.Pass>(),
  check<typeof res10, IterableIterator<123>, Test.Pass>(),
  check<typeof res11, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res12, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res13, AsyncIterableIterator<123>, Test.Pass>(),
]);
