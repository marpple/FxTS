import { keys, pipe } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const obj = {
  a: 1,
  b: "2",
  c: true,
  d: Symbol("a"),
  e: function () {
    return null;
  },
  f: null,
  g: undefined,
};

const res1 = keys(obj);
const res2 = pipe(obj, keys);

// Map type tests
const map1 = new Map<string, number>([
  ["a", 1],
  ["b", 2],
]);
const resMap1 = keys(map1);

const map2 = new Map<number, string>([
  [1, "a"],
  [2, "b"],
]);
const resMap2 = keys(map2);

// Set type tests
const set1 = new Set<number>([1, 2, 3]);
const resSet1 = keys(set1);

const set2 = new Set<string>(["a", "b"]);
const resSet2 = keys(set2);

checks([
  check<typeof res1, Generator<keyof typeof obj, void>, Test.Pass>(),
  check<typeof res2, Generator<keyof typeof obj, void>, Test.Pass>(),

  // Map type checks - keys should return key type
  check<typeof resMap1, Generator<string, void>, Test.Pass>(),
  check<typeof resMap2, Generator<number, void>, Test.Pass>(),

  // Set type checks - keys should return value type (Set has no separate keys)
  check<typeof resSet1, Generator<number, void>, Test.Pass>(),
  check<typeof resSet2, Generator<string, void>, Test.Pass>(),
]);
