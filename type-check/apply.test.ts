import { apply, pipe, range, toArray } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = apply(Math.max, [1, 2, 3, 4, 5]);
const res2 = pipe(range(1, 6), toArray, apply(Math.max));

checks([
  check<typeof res1, ReturnType<typeof Math.max>, Test.Pass>(),
  check<typeof res2, ReturnType<typeof Math.max>, Test.Pass>(),
]);
