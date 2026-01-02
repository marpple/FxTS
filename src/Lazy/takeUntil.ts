import { isAsyncIterable, isIterable } from "../_internal/utils";
import type IterableInfer from "../types/IterableInfer";
import type ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import takeUntilInclusive from "./takeUntilInclusive";

/**
 * Returns Iterable/AsyncIterable that taken values until truthy when given `f` is applied.
 *
 *
 * @deprecated Use `takeUntilInclusive` instead of this function.
 * @example
 * ```ts
 * const iter = takeUntil(a => a % 2 === 0, [1, 2, 3, 4, 5, 6]);
 * iter.next() // {done:false, value: 1}
 * iter.next() // {done:false, value: 2}
 * iter.next() // {done:true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3, 4, 5, 6],
 *  takeUntil(a => a % 2 === 0),
 *  toArray,
 * ); // [1, 2]
 *
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4, 5, 6]),
 *  takeUntil(a => a % 2 === 0),
 *  toArray,
 * ); // [1, 2]
 *
 * // if you want to use asynchronous callback
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4, 5, 6]),
 *  toAsync,
 *  takeUntil(async (a) => a % 2 === 0),
 *  toArray,
 * ); // [1, 2]
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3),
 * Promise.resolve(4), Promise.resolve(5), Promise.resolve(6)],
 *  toAsync,
 *  takeUntil(a => a % 2 === 0),
 *  toArray,
 * ); // [1, 2]
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-takeuntil-gv1jk | Try It}
 *
 * see {@link https://fxts.dev/api/pipe | pipe}, {@link https://fxts.dev/api/toAsync | toAsync},
 * {@link https://fxts.dev/api/toArray | toArray}
 */
function takeUntil<A, B>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): IterableIterator<A>;

function takeUntil<A, B>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A>;

function takeUntil<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: IterableInfer<A>) => B,
): (iterable: A) => ReturnIterableIteratorType<A>;

function takeUntil<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: A) => B,
  iterable?: Iterable<A> | AsyncIterable<A>,
):
  | IterableIterator<IterableInfer<A>>
  | AsyncIterableIterator<IterableInfer<A>>
  | ((iterable: A) => ReturnIterableIteratorType<A>) {
  if (iterable === undefined) {
    return (iterable: A) => {
      return takeUntilInclusive(
        f,
        iterable as any,
      ) as ReturnIterableIteratorType<A>;
    };
  }

  if (isIterable(iterable)) {
    return takeUntilInclusive(f, iterable) as IterableIterator<
      IterableInfer<A>
    >;
  }

  if (isAsyncIterable(iterable)) {
    return takeUntilInclusive(f, iterable) as AsyncIterableIterator<
      IterableInfer<A>
    >;
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default takeUntil;
