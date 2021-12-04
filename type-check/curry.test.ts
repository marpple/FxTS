import * as Test from "../src/types/Test";
import Curry from "../src/types/Curry";
import { curry, pipe, toAsync } from "../src";
import { filter } from "../src/Lazy";

const { checks, check } = Test;

declare function fn(a: string, c: boolean, ...d: number[]): string;

declare const curried: Curry<typeof fn>;

const res1 = curried("a");
const res2 = res1();
const res3 = res2(true);
const res4 = res2(false, 1, 2, 3);

const strictEq = curry(<T>(left: T, right: T) => left === right);

const res5 = pipe([1, 1, 1, 2, 2, 2], filter(strictEq(2)));
const res6 = pipe([1, 1, 1, 2, 2, 2], toAsync, filter(strictEq(2)));

checks([
  check<
    typeof res1,
    Curry<(c: boolean, ...d: number[]) => string>,
    Test.Pass
  >(),
  check<
    typeof res2,
    Curry<(c: boolean, ...d: number[]) => string>,
    Test.Pass
  >(),
  check<typeof res3, string, Test.Pass>(),
  check<typeof res4, string, Test.Pass>(),
  check<typeof res5, IterableIterator<number>, Test.Pass>(),
  check<typeof res6, AsyncIterableIterator<number>, Test.Pass>(),
]);
