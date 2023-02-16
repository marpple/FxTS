import { isBoolean, pipe } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = isBoolean(true);
const res2 = isBoolean("a");
const res3 = pipe(true, isBoolean);

checks([
  check<typeof res1, boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, boolean, Test.Pass>(),
]);
