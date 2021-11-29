import * as Test from "../../src/types/Test";
import { toAsync, dropUntil, pipe } from "../../src";

const { checks, check } = Test;

const res1 = dropUntil((a) => a, []);
const res2 = dropUntil((a) => a > 1, [1, 2, 3, 4]);
const res3 = dropUntil((a) => a > 1, toAsync([1, 2, 3, 4]));
const res4 = pipe(
  [1, 2, 3, 4],
  dropUntil((a) => a > 1),
);
const res5 = pipe(
  toAsync([1, 2, 3, 4]),
  dropUntil((a) => a > 1),
);

checks([
  check<typeof res1, IterableIterator<never>, Test.Pass>(),
  check<typeof res2, IterableIterator<number>, Test.Pass>(),
  check<typeof res3, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res4, IterableIterator<number>, Test.Pass>(),
  check<typeof res5, AsyncIterableIterator<number>, Test.Pass>(),
]);
