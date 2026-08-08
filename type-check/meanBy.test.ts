import { meanBy, pipe, toAsync } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const given = [{ score: 80 }, { score: 100 }];

const res1 = meanBy((a) => a.score, given);
const res2 = meanBy((a) => a.score, toAsync(given));
const res3 = pipe(
  given,
  meanBy((a) => a.score),
);
const res4 = pipe(
  toAsync(given),
  meanBy((a) => a.score),
);

checks([
  check<typeof res1, number, Test.Pass>(),
  check<typeof res2, Promise<number>, Test.Pass>(),
  check<typeof res3, number, Test.Pass>(),
  check<typeof res4, Promise<number>, Test.Pass>(),
]);
