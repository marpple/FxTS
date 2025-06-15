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
]);
