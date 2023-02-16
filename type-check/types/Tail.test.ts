import type Tail from "../../src/types/Tail";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

checks([
  check<Tail<[]>, [], Test.Pass>(),
  check<Tail<[1]>, [], Test.Pass>(),
  check<Tail<[1, 2]>, [2], Test.Pass>(),
  check<Tail<[1, 2, 3]>, [2, 3], Test.Pass>(),
  check<Tail<[1, 2, "abc"]>, [2, "abc"], Test.Pass>(),
  check<Tail<[string, number, boolean]>, [number, boolean], Test.Pass>(),
]);
