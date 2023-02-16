import { filter, isUndefined, pipe } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = isUndefined(undefined);
const res2 = isUndefined(3);
const res3 = pipe([1, undefined, 2], filter(isUndefined));

checks([
  check<typeof res1, boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, IterableIterator<undefined>, Test.Pass>(),
]);
