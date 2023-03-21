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
]);
