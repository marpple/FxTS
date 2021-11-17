import * as Test from "../../src/types/Test";
import Tail from "../../src/types/Tail";

const { checks, check } = Test;

checks([
  check<Tail<[]>, [], Test.Pass>(),
  check<Tail<[1]>, [], Test.Pass>(),
  check<Tail<[1, 2]>, [2], Test.Pass>(),
  check<Tail<[1, 2, 3]>, [2, 3], Test.Pass>(),
]);
