import { always, pipe, range } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = always([1, 2, 3] as const)("arg");
const res2 = always([1, 2, 3])("arg");
const res3 = pipe(range(1, 6), always({ key: "value" }));

checks([
  check<typeof res1, readonly [1, 2, 3], Test.Pass>(),
  check<typeof res2, number[], Test.Pass>(),
  check<typeof res3, { key: string }, Test.Pass>(),
]);
