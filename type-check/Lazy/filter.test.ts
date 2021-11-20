import * as Test from "../../src/types/Test";
import { toAsync, filter, pipe, isString } from "../../src";

const { checks, check } = Test;

const res1 = filter((a) => a % 2 === 0, []);
const res2 = filter((a) => a % 2 === 0, [1, 2, 3]);
const res3 = filter(async (a) => a % 2 === 0, [1, 2, 3]);
const res4 = filter(Boolean, [undefined, null, 0, "", false, -0, 123] as const);
const res5 = filter(isString, [1, "a", true]);
const res6 = filter((a) => a % 2 === 0, toAsync([1, 2, 3]));
const res7 = filter(async (a) => a % 2 === 0, toAsync([1, 2, 3]));
const res8 = filter(
  Boolean,
  toAsync([undefined, null, 0, "", false, -0, 123] as const),
);
const res9 = filter(isString, toAsync([1, "a", true]));

const res10 = pipe(
  [1, 2, 3, 4],
  filter((a) => a % 2 === 0),
);
const res11 = pipe(
  [1, 2, 3, 4],
  filter(async (a) => a % 2 === 0),
);
const res12 = pipe(
  [undefined, null, 0, "", false, -0, 123] as const,
  filter(Boolean),
);
const res13 = pipe([1, "a", true], filter(isString));
const res14 = pipe(
  toAsync([1, 2, 3, 4]),
  filter((a) => a % 2 === 0),
);
const res15 = pipe(
  toAsync([1, 2, 3, 4]),
  filter(async (a) => a % 2 === 0),
);
const res16 = pipe(
  toAsync([undefined, null, 0, "", false, -0, 123] as const),
  filter(Boolean),
);
const res17 = pipe(toAsync([1, "a", true]), filter(isString));

checks([
  check<typeof res1, IterableIterator<never>, Test.Pass>(),
  check<typeof res2, IterableIterator<number>, Test.Pass>(),
  check<typeof res3, IterableIterator<number>, Test.Pass>(),
  check<typeof res4, IterableIterator<123>, Test.Pass>(),
  check<typeof res5, IterableIterator<string>, Test.Pass>(),
  check<typeof res6, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res7, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res8, AsyncIterableIterator<123>, Test.Pass>(),
  check<typeof res9, AsyncIterableIterator<string>, Test.Pass>(),

  check<typeof res10, IterableIterator<number>, Test.Pass>(),
  check<typeof res11, IterableIterator<number>, Test.Pass>(),
  check<typeof res12, IterableIterator<123>, Test.Pass>(),
  check<typeof res13, IterableIterator<string>, Test.Pass>(),
  check<typeof res14, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res15, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res16, AsyncIterableIterator<123>, Test.Pass>(),
  check<typeof res17, AsyncIterableIterator<string>, Test.Pass>(),
]);
