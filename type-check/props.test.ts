import { map, pipe, props, toArray } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const objs = [{ key: "value" } as const, { key: "not value" } as const, null];

const res1 = props(["key"] as const, { key: "value" } as const);
const res2 = props(["key"] as const)({ key: "value" } as const);
const res3 = props(["key"] as const, null);
const res4 = props(["key"] as const)(null);
const res5 = props(["key"] as const, objs[1]);
const res6 = props(["key"] as const)(objs[1]);
const res7 = props(["a", "d"] as const, { a: 1, b: "2", c: true } as const);
const res8 = props(["a", "d"] as const)({ a: 1, b: "2", c: true } as const);
const res9 = props([2, 4] as const, [0, 1, 2, 3] as const);
const res10 = props([2, 4] as const)([0, 1, 2, 3] as const);
const res11 = props(["key"], { key: "value" } as const);
const res12 = props(["key"])({ key: "value" } as const);
const res13 = props(["key"], null);
const res14 = props(["key"])(null);
const res15 = props(["key"], objs[1]);
const res16 = props(["key"])(objs[1]);
const res17 = props(["a", "d"], { a: 1, b: "2", c: true });
const res18 = props(["a", "d"])({ a: 1, b: "2", c: true });
const res19 = props([1, 2], [0, 1, 2, 3]);
const res20 = props([1, 2])([0, 1, 2, 3]);

const res21 = pipe(
  [
    { str: "foo", num: 1 },
    { str: "bar", num: 2 },
  ],
  map(props(["str", "num"] as const)),
  toArray,
);

checks([
  check<typeof res1, ["value"], Test.Pass>(),
  check<typeof res2, ["value"], Test.Pass>(),
  check<typeof res3, [undefined], Test.Pass>(),
  check<typeof res4, [undefined], Test.Pass>(),
  check<typeof res5, ["value" | "not value" | undefined], Test.Pass>(),
  check<typeof res6, ["value" | "not value" | undefined], Test.Pass>(),
  check<typeof res7, [1, undefined], Test.Pass>(),
  check<typeof res8, [1, undefined], Test.Pass>(),
  check<typeof res9, [2, undefined], Test.Pass>(),
  check<typeof res10, [2, undefined], Test.Pass>(),
  check<typeof res11, ("value" | undefined)[], Test.Pass>(),
  check<typeof res12, ("value" | undefined)[], Test.Pass>(),
  check<typeof res13, undefined[], Test.Pass>(),
  check<typeof res14, undefined[], Test.Pass>(),
  check<typeof res15, ("value" | "not value" | undefined)[], Test.Pass>(),
  check<typeof res16, ("value" | "not value" | undefined)[], Test.Pass>(),
  check<typeof res17, (string | number | boolean | undefined)[], Test.Pass>(),
  check<typeof res18, (string | number | boolean | undefined)[], Test.Pass>(),
  check<typeof res19, number[], Test.Pass>(),
  check<typeof res20, number[], Test.Pass>(),
  check<typeof res21, [string, number][], Test.Pass>(),
]);
