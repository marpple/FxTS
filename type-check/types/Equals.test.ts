import * as Test from "../../src/types/Test";
import type Equals from "../../src/types/Equals";

const { checks, check } = Test;

checks([
  check<Equals<1, 1>, 1, Test.Pass>(),
  check<Equals<number, number>, 1, Test.Pass>(),
  check<Equals<number, string>, 1, Test.Fail>(),
  check<Equals<[1, 2, 3], [1, 2, 3]>, 1, Test.Pass>(),
  check<Equals<[{ a: 1; b: 2 }], [{ a: 1; b: 2 }]>, 1, Test.Pass>(),
]);
