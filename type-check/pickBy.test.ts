import { pickBy } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const obj = {
  a: 1,
  b: "2",
  c: true,
};

const res1 = pickBy(([key, value]) => key === "a" || value === true, obj);
const res2 = pickBy(async ([key, value]) => key === "a" || value === true, obj);
const res3 = pickBy(
  ([key, value]) => key === "a" || Promise.resolve(value === true),
  obj,
);

type Res = { a?: number; b?: string; c?: boolean };

checks([
  check<typeof res1, Res, Test.Pass>(),
  check<typeof res2, Promise<Res>, Test.Pass>(),
  check<typeof res3, Res | Promise<Res>, Test.Pass>(),
]);
