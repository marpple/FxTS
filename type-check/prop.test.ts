import { map, pipe, prop, toArray } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = prop(2, [0, 1, 2, 3]);
const res2 = prop("a", { a: 1, b: "2", c: true });
const res3 = prop("b", { a: 1, b: "2", c: true });
const res4 = prop("c", { a: 1, b: "2", c: true });

const res5 = pipe(
  [
    { name: "foo", value: "foo value" },
    { name: "bar", value: "bar value" },
  ],
  map(prop("name")),
  toArray,
);

checks([
  check<typeof res1, number, Test.Pass>(),
  check<typeof res2, number, Test.Pass>(),
  check<typeof res3, string, Test.Pass>(),
  check<typeof res4, boolean, Test.Pass>(),
  check<typeof res5, string[], Test.Pass>(),
]);
