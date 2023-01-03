import * as Test from "../src/types/Test";
import { partition, pipe, toAsync } from "../src";

const { checks, check } = Test;

const res0 = partition((a) => typeof a === "string", []);
const res1 = partition((a) => a > 3, [0, 1, 2, 3, 4]);

type Res1 = [(string | number)[], (string | number)[]];
const list1 = ["3", "4", "5", 1, 2, 3];
const res2 = partition((a) => typeof a === "number", list1);
const res3: Res1 = pipe(
  list1,
  partition((a) => typeof a === "number"),
);
// throw AsyncFunctionException
const res4: Res1 = pipe(
  list1,
  partition((a) => Promise.resolve(typeof a === "number")),
);
const res5: Promise<Res1> = pipe(
  list1,
  toAsync,
  partition((a) => Promise.resolve(typeof a === "number")),
);

type Res2 = [number[], (string | boolean)[]];
const list2 = ["3", "4", "5", 1, 2, 3, true, false];
const res6 = partition((a): a is number => typeof a === "number", list2);
const res7 = pipe(
  list2,
  partition((a): a is number => typeof a === "number"),
);
const res8 = partition(
  (a): a is number => typeof a === "number",
  toAsync(list2),
);
const res9 = pipe(
  list2,
  toAsync,
  partition((a): a is number => typeof a === "number"),
);

checks([
  check<typeof res0, [never[], never[]], Test.Pass>(),
  check<typeof res1, [number[], number[]], Test.Pass>(),
  check<typeof res2, Res1, Test.Pass>(),
  check<typeof res3, Res1, Test.Pass>(),
  check<typeof res4, Res1, Test.Pass>(),
  check<typeof res5, Promise<Res1>, Test.Pass>(),
  check<typeof res6, Res2, Test.Pass>(),
  check<typeof res7, Res2, Test.Pass>(),
  check<typeof res8, Promise<Res2>, Test.Pass>(),
  check<typeof res9, Promise<Res2>, Test.Pass>(),
]);
