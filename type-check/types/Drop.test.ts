import type Drop from "../../src/types/Drop";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

checks([
  check<Drop<0, [1, 2, 3]>, [1, 2, 3], Test.Pass>(),
  check<Drop<1, [1, 2, 3]>, [2, 3], Test.Pass>(),
  check<Drop<2, [1, 2, 3]>, [3], Test.Pass>(),
  check<Drop<3, [1, 2, 3]>, [], Test.Pass>(),
]);
