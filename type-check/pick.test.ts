import * as Test from "../src/types/Test";
import { pick, toAsync } from "../src";

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

const res1 = pick(["a", "b"], obj1);
const res2 = pick(["a", "c"], obj1);
const res3 = pick(toAsync(["a", "b"] as const), obj1);
const res4 = pick(["a", "b"], { a: 1 } as OptionalObj);
const res5 = pick(["b", "c"], {
  a: 1,
  b: Symbol("b"),
  c: Symbol.iterator,
});

checks([
  check<typeof res1, { a: number; b: string }, Test.Pass>(),
  check<typeof res2, { a: number; c: boolean }, Test.Pass>(),
  check<typeof res3, Promise<{ a: number; b: string }>, Test.Pass>(),
  check<typeof res4, { a: number; b?: string }, Test.Pass>(),
  check<typeof res5, { b: symbol; c: symbol }, Test.Pass>(),
]);
