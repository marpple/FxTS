import * as Test from "../../src/types/Test";
import { pipe, repeat } from "../../src";

const { checks, check } = Test;

const res1 = repeat(2, 5);
const res2 = repeat(2, "5");
const res3 = repeat(2, Promise.resolve(5));
const res4 = pipe(5, repeat(2));

checks([
  check<typeof res1, IterableIterator<number>, Test.Pass>(),
  check<typeof res2, IterableIterator<string>, Test.Pass>(),
  check<typeof res3, IterableIterator<Promise<number>>, Test.Pass>(),
  check<typeof res4, IterableIterator<number>, Test.Pass>(),
]);
