import * as Test from "../src/types/Test";
import Curry from "../src/types/Curry";

const { checks, check } = Test;

declare function fn(a: string, c: boolean, ...d: number[]): string;

declare const curried: Curry<typeof fn>;

const res1 = curried("a");
const res2 = res1();
const res3 = res2(true);
const res4 = res2(false, 1, 2, 3);

checks([
  check<
    typeof res1,
    Curry<(c: boolean, ...d: number[]) => string>,
    Test.Pass
  >(),
  check<
    typeof res2,
    Curry<(c: boolean, ...d: number[]) => string>,
    Test.Pass
  >(),
  check<typeof res3, string, Test.Pass>(),
  check<typeof res4, string, Test.Pass>(),
]);
