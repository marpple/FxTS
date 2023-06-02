import { filter, isNull, pipe } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = isNull(undefined);
const res2 = isNull(null);
const res3 = isNull(3);
const res4 = pipe([1, null, 2], filter(isNull));

checks([
  check<typeof res1, boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, boolean, Test.Pass>(),
  check<typeof res4, IterableIterator<null>, Test.Pass>(),
]);
