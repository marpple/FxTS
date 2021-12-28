import * as Test from "../../src/types/Test";
import { keys, pipe } from "../../src";

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

checks([
  check<typeof res1, Generator<keyof typeof obj, void>, Test.Pass>(),
  check<typeof res2, Generator<keyof typeof obj, void>, Test.Pass>(),
]);
