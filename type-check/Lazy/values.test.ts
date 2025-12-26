import { pipe, values } from "../../src";
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

const res1 = values(obj);
const res2 = pipe(obj, values);

// Map type tests
const map1 = new Map<string, number>([
  ["a", 1],
  ["b", 2],
]);
const resMap1 = values(map1);

const map2 = new Map<number, string>([
  [1, "a"],
  [2, "b"],
]);
const resMap2 = values(map2);

// Set type tests
const set1 = new Set<number>([1, 2, 3]);
const resSet1 = values(set1);

const set2 = new Set<string>(["a", "b"]);
const resSet2 = values(set2);

checks([
  check<
    typeof res1,
    Generator<(typeof obj)[keyof typeof obj], void>,
    Test.Pass
  >(),
  check<
    typeof res2,
    Generator<(typeof obj)[keyof typeof obj], void>,
    Test.Pass
  >(),

  // Map type checks - values should return value type
  check<typeof resMap1, Generator<number, void>, Test.Pass>(),
  check<typeof resMap2, Generator<string, void>, Test.Pass>(),

  // Set type checks - values should return value type
  check<typeof resSet1, Generator<number, void>, Test.Pass>(),
  check<typeof resSet2, Generator<string, void>, Test.Pass>(),
]);
