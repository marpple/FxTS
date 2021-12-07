import * as Test from "../src/types/Test";
import { omitBy } from "../src";

const { checks, check } = Test;

const obj = {
  a: 1,
  b: "2",
  c: true,
};

const res1 = omitBy(([key, value]) => key === "a" || value === true, obj);
const res2 = omitBy(async ([key, value]) => key === "a" || value === true, obj);
const res3 = omitBy(
  ([key, value]) => key === "a" || Promise.resolve(value === true),
  obj,
);

type Res = { a?: number; b?: string; c?: boolean };

checks([
  check<typeof res1, Res, Test.Pass>(),
  check<typeof res2, Promise<Res>, Test.Pass>(),
  check<typeof res3, Res | Promise<Res>, Test.Pass>(),
]);
