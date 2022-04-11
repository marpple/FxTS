import * as Test from "../src/types/Test";
import { gte, pipe, filter, toArray, toAsync } from "../src";

const { checks, check } = Test;

const res1 = gte(5);
const res2 = res1(10);

const res3 = gte("b");
const res4 = res3("a");

const res5 = gte(new Date());
const res6 = res5(new Date(2021, 4, 11));

const res7 = pipe(toAsync([1, 2, 3, 4, 5]), filter(gte(3)), toArray);

const res8 = gte(1, 2);
const res9 = gte("a", "b");

checks([
  check<typeof res1, (b: number) => boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, (b: string) => boolean, Test.Pass>(),
  check<typeof res4, boolean, Test.Pass>(),
  check<typeof res5, (b: Date) => boolean, Test.Pass>(),
  check<typeof res6, boolean, Test.Pass>(),
  check<typeof res7, Promise<number[]>, Test.Pass>(),
  check<typeof res8, boolean, Test.Pass>(),
  check<typeof res9, boolean, Test.Pass>(),
]);
