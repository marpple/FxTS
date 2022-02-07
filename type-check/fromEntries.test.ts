import * as Test from "../src/types/Test";
import { fromEntries, entries, pipe, toAsync } from "../src";

const { checks, check } = Test;

const obj = {
  a: 1,
  b: true,
  c: "hello",
  d: { d1: 1, d2: 3 },
};

const arr = [
  ["a", 1],
  ["b", true],
  ["c", "hello"],
  ["d", { d1: 1, d2: 3 }],
] as (
  | ["a", number]
  | ["b", boolean]
  | ["c", string]
  | ["d", { d1: number; d2: number }]
)[];

const res1 = fromEntries(arr);
const res2 = pipe(obj, entries, fromEntries);
const res3 = pipe(obj, entries, (iter) => fromEntries(iter));
const res4 = pipe(obj, entries, toAsync, fromEntries);
const res5 = pipe(obj, entries, toAsync, (iter) => fromEntries(iter));

checks([
  check<typeof res1, typeof obj, Test.Pass>(),
  check<typeof res2, typeof obj, Test.Pass>(),
  check<typeof res3, typeof obj, Test.Pass>(),
  check<typeof res4, Promise<typeof obj>, Test.Pass>(),
  check<typeof res5, Promise<typeof obj>, Test.Pass>(),
]);
