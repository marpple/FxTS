import { pick, toAsync } from "../src";
import * as Test from "../src/types/Test";

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

const res1 = pick([], obj1);
const res2 = pick(["a", "b", "d"], obj1);
const res3 = pick(["a", "c"], obj1);
const res4 = pick(toAsync(["a", "b"] as const), obj1);
const res5 = pick(["a", "b"], { a: 1 } as OptionalObj);

checks([
  check<typeof res1, Record<string, never>, Test.Pass>(),
  check<typeof res2, { a: number; b: string; d: symbol }, Test.Pass>(),
  check<typeof res3, { a: number; c: boolean }, Test.Pass>(),
  check<typeof res4, Promise<{ a: number; b: string }>, Test.Pass>(),
  check<typeof res5, { a: number; b?: string }, Test.Pass>(),
]);
