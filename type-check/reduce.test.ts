import * as Test from "../src/types/Test";
import { pipe, reduce, toAsync } from "../src";

const { checks, check } = Test;

const res1 = reduce((a, b) => a + b, []);
const res2 = reduce((a, b) => a + b, "seed", []);
const res3 = reduce((a, b) => a + b, 0, [1, 2, 3]);
const res4 = reduce((a, b) => a + b, [1, 2, 3]);
const res5 = reduce((a, b) => a + b, "0", [1, 2, 3]);
const res6 = reduce((a: string, b) => String(Number(a) + Number(b)), [1, 2, 3]);

// const res7 = reduce((a, b) => a + b, Promise.resolve(0), [1, 2, 3]); // error
// const res7 = reduce((a, b) => Promise.resolve(a + b), 0, [1, 2, 3]); // error

const res8 = reduce((a, b) => a + b, toAsync([1, 2, 3]));
const res9 = reduce((a, b) => a + b, 0, toAsync([1, 2, 3]));
const res10 = reduce((a, b) => a + b, Promise.resolve(0), toAsync([1, 2, 3]));

const res11 = pipe(
  [1, 2, 3],
  reduce((a, b) => a + b),
);

const res12 = pipe(
  [1, 2, 3],
  reduce((a: string, b) => String(Number(a) + Number(b))),
);

const res13 = pipe(
  [1, 2, 3],
  toAsync,
  reduce((a, b) => a + b),
);

const res14 = pipe(
  [1, 2, 3],
  toAsync,
  reduce((a, b) => Promise.resolve(a + b)),
);

const res15 = pipe(
  [1, 2, 3],
  toAsync,
  reduce((a: string, b) => String(Number(a) + Number(b))),
);

const res16 = pipe(
  [1, 2, 3],
  toAsync,
  reduce((a: string, b) => Promise.resolve(String(Number(a) + Number(b)))),
);

checks([
  check<typeof res1, undefined, Test.Pass>(),
  check<typeof res2, "seed", Test.Pass>(),
  check<typeof res3, number, Test.Pass>(),
  check<typeof res4, number, Test.Pass>(),
  check<typeof res5, string, Test.Pass>(),
  check<typeof res6, string, Test.Pass>(),

  // check<typeof res7, Promise<number>, Test.Pass>(),
  // check<typeof res7, Promise<number>, Test.Pass>(),

  check<typeof res8, Promise<number>, Test.Pass>(),
  check<typeof res9, Promise<number>, Test.Pass>(),
  check<typeof res10, Promise<number>, Test.Pass>(),

  check<typeof res11, number, Test.Pass>(),
  check<typeof res12, string, Test.Pass>(),
  check<typeof res13, Promise<number>, Test.Pass>(),
  check<typeof res14, Promise<number>, Test.Pass>(),
  check<typeof res15, Promise<string>, Test.Pass>(),
  check<typeof res16, Promise<string>, Test.Pass>(),
]);
