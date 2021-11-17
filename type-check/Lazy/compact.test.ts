import * as Test from "../../src/types/Test";
import { toAsync, compact, pipe } from "../../src";

const { checks, check } = Test;

const res1 = compact([]);
const res2 = compact([1, 2, 3, undefined, null]);
const res3 = compact(toAsync([1, 2, 3, undefined, null]));

const res4 = pipe([1, 2, 3, undefined, null], compact);
const res5 = pipe(Promise.resolve([1, 2, 3, undefined, null]), compact); // prettier-ignore
const res6 = pipe(toAsync([1, 2, 3, undefined, null]), compact);

checks([
  check<typeof res1, IterableIterator<never>, Test.Pass>(),

  check<typeof res2, IterableIterator<number>, Test.Pass>(),
  check<typeof res3, AsyncIterableIterator<number>, Test.Pass>(),

  check<typeof res4, IterableIterator<number>, Test.Pass>(),
  check<typeof res5, Promise<IterableIterator<number>>, Test.Pass>(),
  check<typeof res6, AsyncIterableIterator<number>, Test.Pass>(),
]);
