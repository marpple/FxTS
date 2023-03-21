import { pipe, scan, toAsync } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = scan((a, b) => a + b, []);
const res2 = scan((a, b) => a + b, "seed", []);
const res3 = scan((a, b) => a + b, 0, [1, 2, 3]);
const res4 = scan((a, b) => a + b, [1, 2, 3]);
const res5 = scan((a, b) => a + b, "0", [1, 2, 3]);
const res6 = scan((a: string, b) => String(Number(a) + Number(b)), [1, 2, 3]);
const res7 = scan((a, b) => a + b, toAsync([1, 2, 3]));
const res8 = scan((a, b) => a + b, 0, toAsync([1, 2, 3]));
const res9 = scan((a, b) => a + b, Promise.resolve(0), toAsync([1, 2, 3]));
const res10 = scan(
  (a: string, b) => String(Number(a) + Number(b)),
  toAsync([1, 2, 3]),
);
const res11 = scan(
  (a: string, b) => Promise.resolve(String(Number(a) + Number(b))),
  toAsync([1, 2, 3]),
);

const res12 = pipe(
  [1, 2, 3],
  scan((a, b) => a + b),
);

const res13 = pipe(
  [1, 2, 3],
  scan((a: string, b) => String(Number(a) + Number(b))),
);

const res14 = pipe(
  [1, 2, 3],
  toAsync,
  scan((a, b) => a + b),
);

const res15 = pipe(
  [1, 2, 3],
  toAsync,
  scan((a, b) => Promise.resolve(a + b)),
);

const res16 = pipe(
  [1, 2, 3],
  toAsync,
  scan((a: string, b) => String(Number(a) + Number(b))),
);

const res17 = pipe(
  [1, 2, 3],
  toAsync,
  scan((a: string, b) => Promise.resolve(String(Number(a) + Number(b)))),
);

const res18 = pipe([1, 2, 3], toAsync, (res) =>
  scan((a, b) => Promise.resolve(a + b), 0, res),
);

checks([
  check<typeof res1, IterableIterator<never>, Test.Pass>(),
  check<typeof res2, IterableIterator<string>, Test.Pass>(),
  check<typeof res3, IterableIterator<number>, Test.Pass>(),
  check<typeof res4, IterableIterator<number>, Test.Pass>(),
  check<typeof res5, IterableIterator<string>, Test.Pass>(),
  check<typeof res6, IterableIterator<string>, Test.Pass>(),
  check<typeof res7, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res8, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res9, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res10, AsyncIterableIterator<string>, Test.Pass>(),
  check<typeof res11, AsyncIterableIterator<string>, Test.Pass>(),
  check<typeof res12, IterableIterator<number>, Test.Pass>(),
  check<typeof res13, IterableIterator<string>, Test.Pass>(),
  check<typeof res14, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res15, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res16, AsyncIterableIterator<string>, Test.Pass>(),
  check<typeof res17, AsyncIterableIterator<string>, Test.Pass>(),
  check<typeof res18, AsyncIterableIterator<number>, Test.Pass>(),
]);
