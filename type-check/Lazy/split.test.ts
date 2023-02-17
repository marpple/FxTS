import { pipe, split, toAsync } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = split(",", "1,2,3");
const res2 = split(",", toAsync("1,2,3"));

const res3 = pipe("1,2,3,4", split(","));
const res4 = pipe(toAsync("1,2,3,4"), split(","));

checks([
  check<typeof res1, IterableIterator<string>, Test.Pass>(),
  check<typeof res2, AsyncIterableIterator<string>, Test.Pass>(),
  check<typeof res3, IterableIterator<string>, Test.Pass>(),
  check<typeof res4, AsyncIterableIterator<string>, Test.Pass>(),
]);
