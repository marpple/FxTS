import * as Test from "../src/types/Test";
import { lte, pipe, filter, toArray, toAsync } from "../src";

const { checks, check } = Test;

const res1 = lte(5);
const res2 = res1(10);

const res3 = lte("b");
const res4 = res3("a");

const res5 = pipe(toAsync([1, 2, 3, 4, 5]), filter(lte(3)), toArray);

const res6 = lte(1, 2);
const res7 = lte("a", "b");

checks([
  check<typeof res1, (b: string | number | Date) => boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, (b: string | number | Date) => boolean, Test.Pass>(),
  check<typeof res4, boolean, Test.Pass>(),
  check<typeof res5, Promise<number[]>, Test.Pass>(),
  check<typeof res6, boolean, Test.Pass>(),
  check<typeof res7, boolean, Test.Pass>(),
]);
