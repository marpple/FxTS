import { head, pipe, toAsync } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = head([]);
const res2 = head([1]);
const res3 = head([1, "2"]);

// pipeline
const res4 = pipe([1, 2, 3], head);
const res5 = pipe([1, 2, 3], toAsync, head);

// readonly tuple
const res6 = head([] as const);
const res7 = head([1] as const);
const res8 = head([1, "2"] as const);

checks([
  check<typeof res1, undefined, Test.Pass>(),
  check<typeof res2, number | undefined, Test.Pass>(),
  check<typeof res3, number | string | undefined, Test.Pass>(),

  check<typeof res4, number | undefined, Test.Pass>(),
  check<typeof res5, Promise<number | undefined>, Test.Pass>(),

  check<typeof res6, undefined, Test.Pass>(),
  check<typeof res7, 1, Test.Pass>(),
  check<typeof res8, 1, Test.Pass>(),
]);
