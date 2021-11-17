import * as Test from "../src/types/Test";
import { tap } from "../src";

const { checks, check } = Test;

const res1 = tap((a) => a, 123);
const res2 = tap((a) => Promise.resolve(a), "abc");

const res1Promise = tap((a) => a, Promise.resolve(123));
const res2Promise = tap((a) => Promise.resolve(a), Promise.resolve("abc"));

checks([
  check<typeof res1, number, Test.Pass>(),
  check<typeof res2, string, Test.Pass>(),
  check<typeof res1Promise, Promise<number>, Test.Pass>(),
  check<typeof res2Promise, Promise<string>, Test.Pass>(),
]);
