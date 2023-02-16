import { range } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = range(5);
const res2 = range(1, 2);
const res3 = range(1, 2, 1);

checks([
  check<typeof res1, IterableIterator<number>, Test.Pass>(),
  check<typeof res2, IterableIterator<number>, Test.Pass>(),
  check<typeof res3, IterableIterator<number>, Test.Pass>(),
]);
