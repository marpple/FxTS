import { evolve, pipe } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const obj = {
  a: 0,
  b: "1",
  c: true,
};

const transform1 = {
  a: Boolean,
  b: Number,
  c: String,
};

const transform2 = {
  a: Boolean,
  c: String,
};

const res1 = evolve(transform1, obj);
const res2 = evolve(transform2, obj);

// with pipe
const res3 = pipe(obj, evolve(transform1));
const res4 = pipe(obj, evolve(transform2));

// nested object
const obj2 = {
  a: 0,
  b: { c: 1, d: 2 },
  e: 3,
};

const transform3 = {
  a: (v: number) => v + 1,
  b: (obj: (typeof obj2)["b"]) => evolve({ c: Boolean, d: () => null }, obj),
  e: String,
};

const res5 = evolve(transform3, obj2);

checks([
  check<typeof res1, { a: boolean; b: number; c: string }, Test.Pass>(),
  check<typeof res2, { a: boolean; b: string; c: string }, Test.Pass>(),
  check<typeof res3, { a: boolean; b: number; c: string }, Test.Pass>(),
  check<typeof res4, { a: boolean; b: string; c: string }, Test.Pass>(),
  check<
    typeof res5,
    { a: number; b: { c: boolean; d: null }; e: string },
    Test.Pass
  >(),
]);
