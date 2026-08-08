import { zipObject } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = zipObject(["a", "b"] as const, [1, 2]);
const res2 = zipObject(["a", "b"], [1, 2]);

checks([
  check<typeof res1, Record<"a" | "b", number>, Test.Pass>(),
  check<typeof res2, Record<string, number>, Test.Pass>(),
]);
