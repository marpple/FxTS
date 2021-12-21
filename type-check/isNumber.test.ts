import * as Test from "../src/types/Test";
import { isNumber, pipe } from "../src";

const { checks, check } = Test;

const res1 = isNumber(1);
const res2 = isNumber("a");
const res3 = pipe(1, isNumber);

checks([
  check<typeof res1, boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, boolean, Test.Pass>(),
]);
