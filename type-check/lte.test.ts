import * as Test from "../src/types/Test";
import { lte, pipe, filter, toArray, toAsync } from "../src";
import Curry from "../src/types/Curry";

const { checks, check } = Test;

const res1 = lte(5);
const res2 = res1(10);

const res3 = lte("b");
const res4 = res3("a");

const res5 = pipe(toAsync([1, 2, 3, 4, 5]), filter(lte(3)), toArray);

checks([
  check<typeof res1, Curry<(a: number) => boolean>, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, Curry<(a: string) => boolean>, Test.Pass>(),
  check<typeof res4, boolean, Test.Pass>(),
  check<typeof res5, Promise<number[]>, Test.Pass>(),
]);
