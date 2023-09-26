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
]);
