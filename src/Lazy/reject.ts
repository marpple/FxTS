import { isAsyncIterable, isIterable } from "../_internal/utils";
import not from "../not";
import pipe1 from "../pipe1";
import { type ExcludeObject } from "../types/ExcludeObject";
import type IterableInfer from "../types/IterableInfer";
import type ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import filter from "./filter";

/**
 * The opposite of {@link https://fxts.dev/api/filter | filter}
 * Iterable/AsyncIterable of all elements `f` returns falsy for
 *
 * @example
 * ```ts
 * const iter = reject((a)=> a % 2 === 0, [0, 1, 2, 3, 4, 5, 6]);
 * iter.next() // {done:false, value: 1}
 * iter.next() // {done:false, value: 3}
 * iter.next() // {done:false, value: 5}
 * iter.next() // {done:true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  [0, 1, 2, 3, 4, 5, 6],
 *  reject(a => a % 2 === 0),
 *  toArray,
 * ); // [1, 3, 5]
 *
 * await pipe(
 *  Promise.resolve([0, 1, 2, 3, 4, 5, 6]),
 *  reject(a => a % 2 === 0),
 *  toArray,
 * ); // [1, 3, 5]
 *
 * // if you want to use asynchronous callback
 * await pipe(
 *  Promise.resolve([0, 1, 2, 3, 4, 5, 6]),
 *  toAsync,
 *  reject(async a => a % 2 === 0),
 *  toArray,
 * ); // [1, 3, 5]
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(0), Promise.resolve(1), Promise.resolve(2),
 *   Promise.resolve(3), Promise.resolve(4), Promise.resolve(5), Promise.resolve(6)],
 *  toAsync,
 *  reject(a => a % 2 === 0),
 *  toArray,
 * ); // [1, 3, 5]
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-reject-vrc7d | Try It}
 *
 * see {@link https://fxts.dev/api/pipe | pipe}, {@link https://fxts.dev/api/toAsync | toAsync},
 * {@link https://fxts.dev/api/toArray | toArray}
 */

function reject<A, B extends A>(
  f: (a: A) => a is B,
  iterable: Iterable<A>,
): IterableIterator<A extends object ? ExcludeObject<A, B> : Exclude<A, B>>;

function reject<A, B extends A>(
  f: (a: A) => a is B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<
  A extends object ? ExcludeObject<A, B> : Exclude<A, B>
>;

function reject<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B extends IterableInfer<A>,
  C extends B,
  R = B extends object ? ExcludeObject<B, C> : Exclude<B, C>,
>(
  f: (a: IterableInfer<A>) => a is C,
): (
  iterable: A,
) => A extends AsyncIterable<any>
  ? AsyncIterableIterator<R>
  : IterableIterator<R>;

function reject<A, B = unknown>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): IterableIterator<A>;

function reject<A, B = unknown>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A>;

function reject<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B = unknown,
>(
  f: (a: IterableInfer<A>) => B,
  iterable?: A,
): (iterable: A) => ReturnIterableIteratorType<A, IterableInfer<A>>;

function reject<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B = unknown,
>(
  f: (a: IterableInfer<A>) => B,
  iterable?: A,
):
  | IterableIterator<IterableInfer<A>>
  | AsyncIterableIterator<IterableInfer<A>>
  | ((iterable: A) => ReturnIterableIteratorType<A, IterableInfer<A>>) {
  if (iterable === undefined) {
    return (iterable: A): ReturnIterableIteratorType<A, IterableInfer<A>> => {
      return reject(f, iterable as any) as ReturnIterableIteratorType<
        A,
        IterableInfer<A>
      >;
    };
  }

  if (isIterable<IterableInfer<A>>(iterable)) {
    return filter((a) => pipe1(f(a), not), iterable);
  }

  if (isAsyncIterable<IterableInfer<A>>(iterable)) {
    return filter((a) => pipe1(f(a), not), iterable);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default reject;
