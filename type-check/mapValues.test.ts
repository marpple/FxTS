import { mapValues, pipe } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = mapValues((v) => v * 2, { a: 1, b: 2 });
const res2 = mapValues(async (v) => v * 2, { a: 1 });
const res3 = pipe(
  { a: 1, b: 2 },
  mapValues((v) => v * 2),
);
const res4 = mapValues((v) => String(v), { a: 1, b: true });

checks([
  check<typeof res1, { a: number; b: number }, Test.Pass>(),
  check<typeof res2, Promise<{ a: number }>, Test.Pass>(),
  check<typeof res3, { a: number; b: number }, Test.Pass>(),
  check<typeof res4, { a: string; b: string }, Test.Pass>(),
]);
