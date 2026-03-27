import { every, filter, find, matches, pipe, some } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = matches({ a: 1 });
const res2 = matches({ a: 1 })({ a: 1 });
const res3 = matches({ a: { b: { c: 1 } } })({ a: { b: { c: 1 } } });
const res4 = matches(1)(1);
const res5 = matches("a")("a");
const res6 = matches(true)(true);
const res7 = matches(null)(null);
const res8 = matches(undefined)(undefined);
const res9 = matches([1, 2, 3])([1, 2, 3]);
const res10 = matches(new Date())(new Date());
const res11 = matches(/abc/gi)(/abc/gi);

const input = { a: 1, b: 2 };
const res12 = matches({ a: 1 })(input);

const res13 = pipe({ a: 1 }, matches({ a: 1 }));
const res14 = find(matches({ a: 1 }), [{ a: 1 }, { a: 2 }]);
const res15 = filter(matches({ a: 1 }), [{ a: 1 }, { a: 2 }]);
const res16 = some(matches({ a: 1 }), [{ a: 1 }, { a: 2 }]);
const res17 = every(matches({ a: 1 }), [{ a: 1 }, { a: 1 }]);

checks([
  check<typeof res1, (input: { a: number }) => boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, boolean, Test.Pass>(),
  check<typeof res4, boolean, Test.Pass>(),
  check<typeof res5, boolean, Test.Pass>(),
  check<typeof res6, boolean, Test.Pass>(),
  check<typeof res7, boolean, Test.Pass>(),
  check<typeof res8, boolean, Test.Pass>(),
  check<typeof res9, boolean, Test.Pass>(),
  check<typeof res10, boolean, Test.Pass>(),
  check<typeof res11, boolean, Test.Pass>(),
  check<typeof res12, boolean, Test.Pass>(),
  check<typeof res13, boolean, Test.Pass>(),
  check<typeof res14, { a: number } | undefined, Test.Pass>(),
  check<typeof res15, IterableIterator<{ a: number }>, Test.Pass>(),
  check<typeof res16, boolean, Test.Pass>(),
  check<typeof res17, boolean, Test.Pass>(),
]);
