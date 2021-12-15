import * as Test from "../src/types/Test";
import { isEmpty, pipe } from "../src";

const { checks, check } = Test;

const res1 = isEmpty([]);
const res2 = isEmpty([1]);
const res3 = pipe([1], isEmpty);

checks([
  check<typeof res1, boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, boolean, Test.Pass>(),
]);
