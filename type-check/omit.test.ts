import * as Test from "../src/types/Test";
import { omit, toAsync } from "../src";

const { checks, check } = Test;

const obj1 = {
  a: 1,
  b: "2",
  c: true,
  d: Symbol("d"),
};

type OptionalObj = {
  a: number;
  b?: string;
};

const res1 = omit([], obj1);
const res2 = omit(["a", "b"], obj1);
const res3 = omit(["a", "c"], obj1);
const res4 = omit(toAsync(["a", "c"] as const), obj1);
const res5 = omit(["a"], { a: 1 } as OptionalObj);

checks([
  check<typeof res1, typeof obj1, Test.Pass>(),
  check<typeof res2, { c: boolean; d: symbol }, Test.Pass>(),
  check<typeof res3, { b: string; d: symbol }, Test.Pass>(),
  check<typeof res4, Promise<{ b: string; d: symbol }>, Test.Pass>(),
  check<typeof res5, { b?: string }, Test.Pass>(),
]);
