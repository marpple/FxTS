import * as Test from "../../src/types/Test";
import { toAsync, concurrent, pipe } from "../../src";

const { checks, check } = Test;

const res1 = concurrent(3, toAsync([1, 2, 3, 4]));
const res2 = pipe(toAsync([1, 2, 3, 4]), concurrent(3));

checks([
  check<typeof res1, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res2, AsyncIterableIterator<number>, Test.Pass>(),
]);
