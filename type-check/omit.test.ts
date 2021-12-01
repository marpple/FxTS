import * as Test from "../src/types/Test";
import { omit, toAsync } from "../src";

const { checks, check } = Test;

const obj1 = {
  a: 1,
  b: "2",
  c: true,
};

type OptionalObj = {
  a: number;
  b?: string;
};

const res1 = omit(["a", "b"], obj1);
const res2 = omit(["a", "c"], obj1);
const res3 = omit(toAsync(["a", "c"] as const), obj1);
const res4 = omit(["a"], { a: 1 } as OptionalObj);
const res5 = omit(["a"], {
  a: 1,
  b: Symbol("b"),
  c: Symbol.iterator,
});

checks([
  check<typeof res1, { c: boolean }, Test.Pass>(),
  check<typeof res2, { b: string }, Test.Pass>(),
  check<typeof res3, Promise<{ b: string }>, Test.Pass>(),
  check<typeof res4, { b?: string }, Test.Pass>(),
  check<typeof res5, { b: symbol; c: symbol }, Test.Pass>(),
]);
