import { map, pipe, toAsync } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = map((a) => a, [1, 2, 3]);
const res2 = map((a) => `${a}`, [1, 2, 3]);
const res3 = map(async (a) => a, [1, 2, 3]);
const res4 = map((a) => a, toAsync([1, 2, 3]));
const res5 = map(async (a) => a, toAsync([1, 2, 3]));

const res6 = pipe(
  [1, 2, 3, 4],
  map((a) => a),
);
const res7 = pipe(
  [1, 2, 3, 4],
  map((a) => `${a}`),
);
const res8 = pipe(
  [1, 2, 3, 4],
  map(async (a) => a),
);
const res9 = pipe(
  toAsync([1, 2, 3, 4]),
  map((a) => a),
);
const res10 = pipe(
  toAsync([1, 2, 3, 4]),
  map(async (a) => a),
);

checks([
  check<typeof res1, IterableIterator<number>, Test.Pass>(),
  check<typeof res2, IterableIterator<string>, Test.Pass>(),
  check<typeof res3, IterableIterator<Promise<number>>, Test.Pass>(),
  check<typeof res4, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res5, AsyncIterableIterator<number>, Test.Pass>(),

  check<typeof res6, IterableIterator<number>, Test.Pass>(),
  check<typeof res7, IterableIterator<string>, Test.Pass>(),
  check<typeof res8, IterableIterator<Promise<number>>, Test.Pass>(),
  check<typeof res9, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res10, AsyncIterableIterator<number>, Test.Pass>(),
]);
