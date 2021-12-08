import * as Test from "../src/types/Test";
import { tap } from "../src";

const { checks, check } = Test;

const res1 = tap((a) => a, 123);
const res2 = tap((a) => Promise.resolve(a), "abc");
const res3 = tap((a) => a, Promise.resolve(123));
const res4 = tap((a) => Promise.resolve(a), Promise.resolve("abc"));
const res5 = tap((a) => (a > 5 ? a : Promise.resolve(a)), Math.random() * 10);
const res6 = tap((a) => (a > 5 ? a : Promise.resolve(a)), Promise.resolve(Math.random() * 10)); // prettier-ignore

checks([
  check<typeof res1, number, Test.Pass>(),
  check<typeof res2, Promise<string>, Test.Pass>(),
  check<typeof res3, Promise<number>, Test.Pass>(),
  check<typeof res4, Promise<string>, Test.Pass>(),
  check<typeof res5, number | Promise<number>, Test.Pass>(),
  check<typeof res6, Promise<number>, Test.Pass>(),
]);
