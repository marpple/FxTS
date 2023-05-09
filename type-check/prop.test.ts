import { map, pipe, prop, toArray } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const objs = [{ key: "value" } as const, { key: "not value" } as const, null];

const res1 = prop("key", { key: "value" } as const);
const res2 = prop("key")({ key: "value" } as const);
const res3 = prop("key", null);
const res4 = prop("key")(null);
const res5 = prop("key", objs[1]);
const res6 = prop("key")(objs[1]);
const res7 = prop(2 as const, [0, 1, 2, 3] as const);
const res8 = prop(2, [0, 1, 2, 3]);
const res9 = prop("a", { a: 1, b: "2", c: true });
const res10 = prop("b", { a: 1, b: "2", c: true });

const res11 = pipe(
  [
    { str: "foo", num: 1 },
    { str: "bar", num: 2 },
  ],
  map(prop("str")),
  toArray,
);

checks([
  check<typeof res1, "value", Test.Pass>(),
  check<typeof res2, "value", Test.Pass>(),
  check<typeof res3, undefined, Test.Pass>(),
  check<typeof res4, undefined, Test.Pass>(),
  check<typeof res5, "value" | "not value" | undefined, Test.Pass>(),
  check<typeof res6, "value" | "not value" | undefined, Test.Pass>(),
  check<typeof res7, 2, Test.Pass>(),
  check<typeof res8, number, Test.Pass>(),
  check<typeof res9, number, Test.Pass>(),
  check<typeof res10, string, Test.Pass>(),
  check<typeof res11, string[], Test.Pass>(),
]);
