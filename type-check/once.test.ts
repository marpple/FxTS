import { once } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const f = once((a: number, b: string) => a + b.length);
const res1 = f(1, "ab");

const g = once(async () => "done");
const res2 = g();

checks([
  check<typeof f, (a: number, b: string) => number, Test.Pass>(),
  check<typeof res1, number, Test.Pass>(),
  check<typeof res2, Promise<string>, Test.Pass>(),
]);
