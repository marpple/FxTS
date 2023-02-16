import * as Test from "../../src/types/Test";
import type Last from "../../src/types/Last";

const { checks, check } = Test;

checks([
  check<Last<[1]>, 1, Test.Pass>(),
  check<Last<[1, 2, 3]>, 3, Test.Pass>(),
]);

declare function addN(a: number): number;
declare function addS(a: number): string;

checks([check<Last<[typeof addN, typeof addS]>, typeof addS, Test.Pass>()]);
