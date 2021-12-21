import * as Test from "../src/types/Test";
import { add, pipe } from "../src";

const { checks, check } = Test;

const res1 = add(1, 2);
const res2 = add("a", "b");
const res3 = add(Promise.resolve(1), 2);
const res4 = add(1, Promise.resolve(2));
const res5 = add(Promise.resolve(1), Promise.resolve(2));
const res6 = add(Promise.resolve("a"), "b");
const res7 = add("a", Promise.resolve("b"));
const res8 = add(Promise.resolve("a"), Promise.resolve("b"));
const res9 = pipe(2, add(1));
const res10 = pipe("b", add("a"));
const res11 = pipe(Promise.resolve(2), add(1));
const res12 = pipe(Promise.resolve("b"), add("a"));
const res13 = add(2)(3);
const res14 = add("a")("b");

checks([
  check<typeof res1, number, Test.Pass>(),
  check<typeof res2, string, Test.Pass>(),
  check<typeof res3, Promise<number>, Test.Pass>(),
  check<typeof res4, Promise<number>, Test.Pass>(),
  check<typeof res5, Promise<number>, Test.Pass>(),
  check<typeof res6, Promise<string>, Test.Pass>(),
  check<typeof res7, Promise<string>, Test.Pass>(),
  check<typeof res8, Promise<string>, Test.Pass>(),
  check<typeof res9, number, Test.Pass>(),
  check<typeof res10, string, Test.Pass>(),
  check<typeof res11, Promise<number>, Test.Pass>(),
  check<typeof res12, Promise<string>, Test.Pass>(),
  check<typeof res13, number, Test.Pass>(),
  check<typeof res14, string, Test.Pass>(),
]);
