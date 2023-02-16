import { isArray } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = isArray([1, 2, 3]);
const res2 = isArray("a");

checks([
  check<typeof res1, boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
]);
