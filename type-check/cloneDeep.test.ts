import { cloneDeep } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const num = 1 as number;

const res1 = cloneDeep({ a: 1, b: { c: "x" } });
const res2 = cloneDeep([1, 2, 3]);
const res3 = cloneDeep(new Map([["a", 1]]));
const res4 = cloneDeep(new Set([1, 2, 3]));
const res5 = cloneDeep(num);
const res6 = cloneDeep(null);

checks([
  check<typeof res1, { a: number; b: { c: string } }, Test.Pass>(),
  check<typeof res2, number[], Test.Pass>(),
  check<typeof res3, Map<string, number>, Test.Pass>(),
  check<typeof res4, Set<number>, Test.Pass>(),
  check<typeof res5, number, Test.Pass>(),
  check<typeof res6, null, Test.Pass>(),
]);
