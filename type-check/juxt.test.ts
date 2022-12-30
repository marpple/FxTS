import * as Test from "../src/types/Test";
import { apply, pipe, juxt } from "../src";

const { checks, check } = Test;

declare function f1(a: number, b: string): string;
declare function f2(a: number, b: string): boolean;
// declare function f3(a: number, b: boolean): number;
// declare function f4(a: number, b: string, c: boolean): number;

const res0 = juxt([])();

const res1 = juxt([
  (arg1: { a: number }) => String(arg1.a),
  (arg1: { b: number }) => arg1.b > 0,
])({ a: 1, b: 2 });

const res2 = juxt([f1, f2])(1, "2");

// pipeline
const res3 = pipe([1, 2, 3, 4], apply(juxt([Math.max, Math.min])));
const res4 = pipe(juxt([f1, f2]), (f) => f(1, "2"));
const res5 = pipe([f1, f2] as const, juxt, (f) => f(1, "2"));
const res6 = pipe([f1, f2] as [typeof f1, typeof f2], juxt, (f) => f(1, "2"));
const res7 = juxt([Math.min, Math.max])(1, 2, 3, -4, 5, 6, 7);

/* error
const error1 = juxt([
  (arg1: { a: number }, arg2: { c: string }) => String(arg1.a) + arg2.c,
  (arg1: { b: number }) => arg1.b > 0,
])({ a: 1, b: 2 });
const error2 = pipe([f2, f3] as const, juxt, (f) => f());
const error3 = pipe([f2, f3], juxt, (f) => f(1, "2"));
const error4 = pipe([f2, f4], juxt, (f) => f(1, "2"));
const error5 = pipe([f2, f4] as const, juxt, (f) => f(1, "2", true));
*/

checks([
  check<typeof res0, [], Test.Pass>(),
  check<typeof res1, [string, boolean], Test.Pass>(),
  check<typeof res2, [string, boolean], Test.Pass>(),
  check<typeof res3, [number, number], Test.Pass>(),
  check<typeof res4, [string, boolean], Test.Pass>(),
  check<typeof res5, [string, boolean], Test.Pass>(),
  check<typeof res6, [string, boolean], Test.Pass>(),
  check<typeof res7, [number, number], Test.Pass>(),
]);
