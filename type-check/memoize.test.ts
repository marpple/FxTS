import { memoize } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

function add10(a: number): number {
  return a + 10;
}

const memoized1 = memoize(add10);
const res1 = memoized1(10);

function printHelloworld(a: string): string {
  return `hello world: ${a}`;
}

const memoized2 = memoize(printHelloworld);
const res2 = memoized2("marpple");

function printHelloworld2(obj: { key: string }): string {
  return obj.key + " world";
}

const memoizedWeakMap = memoize(printHelloworld2);
memoizedWeakMap.cache = new WeakMap();
const res3 = memoizedWeakMap({ key: "hello" });

checks([
  check<
    typeof memoized1,
    ((a: number) => number) & {
      cache: Map<number, number>;
    },
    Test.Pass
  >(),

  check<typeof res1, number, Test.Pass>(),

  check<
    typeof memoized2,
    ((a: string) => string) & {
      cache: Map<string, string>;
    },
    Test.Pass
  >(),

  check<typeof res2, string, Test.Pass>(),

  check<
    typeof memoizedWeakMap,
    ((obj: { key: string }) => string) & {
      cache: WeakMap<
        {
          key: string;
        },
        string
      >;
    },
    Test.Pass
  >(),

  check<typeof res3, string, Test.Pass>(),
]);
