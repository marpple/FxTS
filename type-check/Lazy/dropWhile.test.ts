import { dropWhile, pipe, toAsync } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = dropWhile((a) => a, []);
const res2 = dropWhile((a) => a, [1, 2, 3, 4]);
const res3 = dropWhile((a) => a, toAsync([1, 2, 3, 4]));
const res4 = pipe(
  [1, 2, 3, 4],
  dropWhile((a) => a),
);
const res5 = pipe(
  toAsync([1, 2, 3, 4]),
  dropWhile((a) => a),
);

checks([
  check<typeof res1, IterableIterator<never>, Test.Pass>(),
  check<typeof res2, IterableIterator<number>, Test.Pass>(),
  check<typeof res3, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res4, IterableIterator<number>, Test.Pass>(),
  check<typeof res5, AsyncIterableIterator<number>, Test.Pass>(),
]);
