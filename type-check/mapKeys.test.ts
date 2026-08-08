import { mapKeys, pipe } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = mapKeys((v, k) => k.toUpperCase(), { a: 1, b: 2 });
const res2 = mapKeys(() => "x" as const, { a: 1 });
const res3 = mapKeys(async (v, k) => k.toUpperCase(), { a: 1 });
const res4 = pipe(
  { a: 1, b: 2 },
  mapKeys((v, k) => k.toUpperCase()),
);

checks([
  check<typeof res1, Record<string, number>, Test.Pass>(),
  check<typeof res2, Record<"x", number>, Test.Pass>(),
  check<typeof res3, Promise<Record<string, number>>, Test.Pass>(),
  check<typeof res4, Record<string, number>, Test.Pass>(),
]);
