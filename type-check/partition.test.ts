import * as Test from "../src/types/Test";
import { partition, pipe, toAsync } from "../src";

const { checks, check } = Test;

type Res = [(string | number)[], (string | number)[]];

const res1 = partition((a) => typeof a === "string", []);
const res2: Res = partition(
  (a) => typeof a === "number",
  ["3", "4", "5", 1, 2, 3],
);
const res3: Res = pipe(
  ["3", "4", "5", 1, 2, 3],
  partition((a) => typeof a === "number"),
);
// throw AsyncFunctionException
const res4: Res = pipe(
  ["3", "4", "5", 1, 2, 3],
  partition((a) => Promise.resolve(typeof a === "number")),
);
const res5: Promise<Res> = pipe(
  ["3", "4", "5", 1, 2, 3],
  toAsync,
  partition((a) => Promise.resolve(typeof a === "number")),
);

checks([
  check<typeof res1, [never[], never[]], Test.Pass>(),
  check<typeof res2, Res, Test.Pass>(),
  check<typeof res3, Res, Test.Pass>(),
  check<typeof res4, Res, Test.Pass>(),
  check<typeof res5, Promise<Res>, Test.Pass>(),
]);
