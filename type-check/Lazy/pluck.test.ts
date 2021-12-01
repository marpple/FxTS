import * as Test from "../../src/types/Test";
import { pluck, toAsync, pipe } from "../../src";

const { checks, check } = Test;
const given = [
  { id: 1, age: 21 },
  { id: 2, age: 22 },
  { id: 3, age: 23 },
  { id: 4, age: 24 },
];

const res1 = pluck("age", given);
const res2 = pluck("age", toAsync(given));

const res3 = pipe(given, pluck("age"));
const res5 = pipe(toAsync(given), pluck("age"));

checks([
  check<typeof res1, IterableIterator<number>, Test.Pass>(),
  check<typeof res2, AsyncIterableIterator<number>, Test.Pass>(),

  check<typeof res3, IterableIterator<number>, Test.Pass>(),
  check<typeof res5, AsyncIterableIterator<number>, Test.Pass>(),
]);
