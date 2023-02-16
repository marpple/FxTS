import { peek, pipe, toAsync } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = peek((a) => a, [1, 2, 3]);
const res2 = peek(async (a) => a, [1, 2, 3]);
const res3 = peek((a) => a, toAsync([1, 2, 3]));
const res4 = peek(async (a) => a, toAsync([1, 2, 3]));

const res5 = pipe(
  [1, 2, 3, 4],
  peek((a) => a),
);
const res6 = pipe(
  [1, 2, 3, 4],
  peek(async (a) => a),
);
const res7 = pipe(
  toAsync([1, 2, 3, 4]),
  peek((a) => a),
);
const res8 = pipe(
  toAsync([1, 2, 3, 4]),
  peek(async (a) => a),
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
]);
