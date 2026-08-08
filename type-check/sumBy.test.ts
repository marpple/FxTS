import { pipe, sumBy, toAsync } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const given = [{ price: 100 }, { price: 200 }];

const res1 = sumBy((a) => a.price, given);
const res2 = sumBy((a) => a.price, toAsync(given));
const res3 = pipe(
  given,
  sumBy((a) => a.price),
);
const res4 = pipe(
  toAsync(given),
  sumBy((a) => a.price),
);

checks([
  check<typeof res1, number, Test.Pass>(),
  check<typeof res2, Promise<number>, Test.Pass>(),
  check<typeof res3, number, Test.Pass>(),
  check<typeof res4, Promise<number>, Test.Pass>(),
]);
