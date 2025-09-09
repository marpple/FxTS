import { evolve, pipe, resolveProps } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = pipe(
  {
    1: Promise.resolve(1),
    a: Promise.resolve("a"),
    undefined: Promise.resolve(undefined),
    null: Promise.resolve(null),
    bool: Promise.resolve(true),
    object: Promise.resolve({ key: "value" }),
  },
  resolveProps,
);
const res2 = pipe(
  {
    notPromiseProp: 1,
    promiseProp: Promise.resolve(1),
  },
  resolveProps,
);
const res3 = pipe(
  {
    notPromiseAsync: 1,
    notPromiseResolve: 1,
    promiseAsync: Promise.resolve(1),
    promiseThen: Promise.resolve(1),
  },
  evolve({
    notPromiseAsync: async (x) => ({ a: x }),
    notPromiseResolve: (x) => Promise.resolve({ b: x + 1 }),
    promiseAsync: async (x) => ({ c: (await x) + 2 }),
    promiseThen: (x) => x.then((d) => ({ d: d + 3 })),
  }),
  resolveProps,
);

checks([
  check<
    typeof res1,
    Promise<{
      1: number;
      a: string;
      undefined: undefined;
      null: null;
      bool: boolean;
      object: { key: string };
    }>,
    Test.Pass
  >(),
  check<
    typeof res2,
    Promise<{
      notPromiseProp: number;
      promiseProp: number;
    }>,
    Test.Pass
  >(),
  check<
    typeof res3,
    Promise<{
      notPromiseAsync: { a: number };
      notPromiseResolve: { b: number };
      promiseAsync: { c: number };
      promiseThen: { d: number };
    }>,
    Test.Pass
  >(),
]);
