import * as Test from "../../src/types/Test";
import { isNil, isString, pipe, reject, toAsync } from "../../src";

const { checks, check } = Test;

const res1 = reject((a) => a % 2 === 0, [1, 2, 3]);
const res2 = reject(async (a) => a % 2 === 0, [1, 2, 3]);
const res3 = reject((a) => a % 2 === 0, toAsync([1, 2, 3]));
const res4 = reject(async (a) => a % 2 === 0, toAsync([1, 2, 3]));

const res5 = pipe(
  [1, 2, 3, 4],
  reject((a) => a % 2 === 0),
);
const res6 = pipe(
  [1, 2, 3, 4],
  reject(async (a) => a % 2 === 0),
);
const res7 = pipe(
  toAsync([1, 2, 3, 4]),
  reject((a) => a % 2 === 0),
);
const res8 = pipe(
  toAsync([1, 2, 3, 4]),
  reject(async (a) => a % 2 === 0),
);

const res9 = reject(isNil, [1, 2, 3, "4", "5", "6", null, undefined]);
const res10 = reject(isNil, toAsync([1, 2, 3, "4", "5", "6", null, undefined]));
const res11 = pipe(
  [1, 2, 3, "4", "5", "6", null, undefined],
  reject(isNil),
  reject(isString),
);
const res12 = pipe(
  [1, 2, 3, "4", "5", "6", null, undefined],
  toAsync,
  reject(isNil),
  reject(isString),
);

checks([
  check<typeof res1, IterableIterator<number>, Test.Pass>(),
  check<typeof res2, IterableIterator<number>, Test.Pass>(),
  check<typeof res3, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res4, AsyncIterableIterator<number>, Test.Pass>(),

  check<typeof res5, IterableIterator<number>, Test.Pass>(),
  check<typeof res6, IterableIterator<number>, Test.Pass>(),
  check<typeof res7, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res8, AsyncIterableIterator<number>, Test.Pass>(),

  check<typeof res9, IterableIterator<number | string>, Test.Pass>(),
  check<typeof res10, AsyncIterableIterator<number | string>, Test.Pass>(),
  check<typeof res11, IterableIterator<number>, Test.Pass>(),
  check<typeof res12, AsyncIterableIterator<number>, Test.Pass>(),
]);
