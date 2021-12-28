import * as Test from "../../src/types/Test";
import { entries, pipe } from "../../src";

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
]);
