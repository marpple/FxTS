import { isAsyncIterable, isIterable } from "./_internal/utils";
import identity from "./identity";
import map from "./Lazy/map";
import takeUntil from "./Lazy/takeUntil";
import pipe from "./pipe";
import reduce from "./reduce";
import type Arrow from "./types/Arrow";
import type IterableInfer from "./types/IterableInfer";
import type ReturnValueType from "./types/ReturnValueType";

/**
 * Returns true if any of the values in Iterable/AsyncIterable pass `f` truth test
 *
 * @example
 * ```ts
 * some(a=> a, [null, 0, 1, false]); // true
 *
 * // with pipe
 * pipe(
 *  [{id:1, age: 27}, {id:2, age: 36}, {id:3, age: 42}],
 *  map(user => user.age),
 *  some(age => age > 40),
 * ); // true
 *
 * await pipe(
 *  Promise.resolve([{id:1, age: 27}, {id:2, age: 36}, {id:3, age: 42}]),
 *  map(user => user.age),
 *  some(age => age > 40),
 * ); // true
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve({id:1, age: 27}), Promise.resolve({id:2, age: 36}), Promise.resolve({id:3, age: 42})],
 *  toAsync,
 *  map(user => user.age),
 *  some(age => age > 40),
 * ); // true
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-some-inp3l | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/map | map}
 */
// prettier-ignore

function some<A extends readonly []>(
    f: Arrow,
    iterable: A
): false;

function some<A, B = unknown>(f: (a: A) => B, iterable: Iterable<A>): boolean;

function some<A, B = unknown>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): Promise<boolean>;

function some<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B = unknown,
>(f: (a: IterableInfer<A>) => B): (a: A) => ReturnValueType<A, boolean>;

function some<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B = unknown,
>(
  f: (a: IterableInfer<A>) => B,
  iterable?: A,
): boolean | Promise<boolean> | ((iterable: A) => ReturnValueType<A, boolean>) {
  if (iterable === undefined) {
    return (iterable: A) => {
      return some(f, iterable as any) as ReturnValueType<A, boolean>;
    };
  }

  if (isIterable<IterableInfer<A>>(iterable)) {
    return pipe(
      map(f, iterable),
      takeUntil(identity),
      reduce((a, b) => a || b),
      Boolean,
    );
  }

  if (isAsyncIterable<IterableInfer<A>>(iterable)) {
    return pipe(
      map(f, iterable),
      takeUntil(identity),
      reduce((a, b) => a || b),
      Boolean,
    );
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default some;
