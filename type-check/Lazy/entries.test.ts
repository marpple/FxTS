import { entries, pipe } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const obj = {
  a: 1,
  b: "2",
  c: true,
  d: null,
  e: undefined,
  f: () => true,
};

const res1 = entries(obj);
const res2 = pipe(obj, entries);

type Obj = {
  [key: string]: number;
};

const fn = (obj: Obj) => entries(obj);
const res3 = fn({ hello: 3 });

const obj2: {
  [x: number]: string;
} = { 2025: "year", 2024: "year" };
const res4 = entries(obj2);

const res5 = entries({ 1: 1, a: "a", [Symbol("a")]: "a" });

// Map type tests
const map1 = new Map<string, number>([
  ["a", 1],
  ["b", 2],
]);
const resMap1 = entries(map1);

const map2 = new Map<number, string>([
  [1, "a"],
  [2, "b"],
]);
const resMap2 = entries(map2);

// Set type tests
const set1 = new Set<number>([1, 2, 3]);
const resSet1 = entries(set1);

const set2 = new Set<string>(["a", "b"]);
const resSet2 = entries(set2);

checks([
  check<
    typeof res1,
    Generator<
      | ["a", number]
      | ["b", string]
      | ["c", boolean]
      | ["d", null]
      | ["e", undefined]
      | ["f", () => boolean],
      void
    >,
    Test.Pass
  >(),
  check<
    typeof res2,
    Generator<
      | ["a", number]
      | ["b", string]
      | ["c", boolean]
      | ["d", null]
      | ["e", undefined]
      | ["f", () => boolean],
      void
    >,
    Test.Pass
  >(),

  check<typeof res3, Generator<[string, number], void, unknown>, Test.Pass>(),
  check<
    typeof res4,
    Generator<[`${number}`, string], void, unknown>,
    Test.Pass
  >(),
  check<
    typeof res5,
    Generator<["1", number] | ["a", string], void>,
    Test.Pass
  >(),

  // Map type checks
  check<typeof resMap1, Generator<[string, number], void>, Test.Pass>(),
  check<typeof resMap2, Generator<[number, string], void>, Test.Pass>(),

  // Set type checks
  check<typeof resSet1, Generator<[number, number], void>, Test.Pass>(),
  check<typeof resSet2, Generator<[string, string], void>, Test.Pass>(),
]);
