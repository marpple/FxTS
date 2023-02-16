import { flat, pipe, range, toAsync } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = flat([]);
const res2 = flat([1, 2, 3]);
const res3 = flat([1, 2, 3, [4, 5]]);
const res4 = flat([1, 2, 3, [4, 5, [6]]]);
const res5 = flat([1, 2, 3, [4, 5, [6]]], 2);

const res6 = flat(toAsync([1, 2, 3]));
const res7 = flat(toAsync([1, 2, 3, [4, 5]]));
const res8 = flat(toAsync([1, 2, 3, [4, 5, [6]]]));
const res9 = flat(toAsync([1, 2, 3, [4, 5, [6]]]), 2);

const res10 = pipe([1, 2, 3], flat);
const res11 = pipe([1, 2, 3, [4, 5]], flat);
const res12 = pipe([1, 2, 3, [4, 5, [6]]], flat);

const res13 = pipe(toAsync([1, 2, 3]), flat);
const res14 = pipe(toAsync([1, 2, 3, [4, 5]]), flat);
const res15 = pipe(toAsync([1, 2, 3, [4, 5, [6]]]), flat);

const res16 = flat(
  (function* () {
    yield* range(1, 3);
    yield toAsync(range(3, 5));
  })(),
);

checks([
  check<typeof res1, IterableIterator<never>, Test.Pass>(),
  check<typeof res2, IterableIterator<number>, Test.Pass>(),
  check<typeof res3, IterableIterator<number>, Test.Pass>(),
  check<typeof res4, IterableIterator<number | number[]>, Test.Pass>(),
  check<typeof res5, IterableIterator<number>, Test.Pass>(),

  check<typeof res6, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res7, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res8, AsyncIterableIterator<number | number[]>, Test.Pass>(), // prettier-ignore
  check<typeof res9, AsyncIterableIterator<number>, Test.Pass>(),

  check<typeof res10, IterableIterator<number>, Test.Pass>(),
  check<typeof res11, IterableIterator<number>, Test.Pass>(),
  check<typeof res12, IterableIterator<number | number[]>, Test.Pass>(),

  check<typeof res13, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res14, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res15, AsyncIterableIterator<number | number[]>, Test.Pass>(), // prettier-ignore
  check<typeof res16, IterableIterator<number | AsyncIterableIterator<number>>, Test.Pass>(), // prettier-ignore
]);
