import { minBy, pipe, toAsync } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const given = [{ age: 1 }, { age: 2 }];

const res1 = minBy((a) => a.age, given);
const res2 = minBy((a) => a.age, toAsync(given));
const res3 = pipe(
  given,
  minBy((a) => a.age),
);
const res4 = pipe(
  toAsync(given),
  minBy((a) => a.age),
);

checks([
  check<typeof res1, { age: number } | undefined, Test.Pass>(),
  check<typeof res2, Promise<{ age: number } | undefined>, Test.Pass>(),
  check<typeof res3, { age: number } | undefined, Test.Pass>(),
  check<typeof res4, Promise<{ age: number } | undefined>, Test.Pass>(),
]);
