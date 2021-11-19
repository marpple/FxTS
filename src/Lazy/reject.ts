import filter from "./filter";
import pipe1 from "../pipe1";
import not from "../not";
import { isAsyncIterable, isIterable } from "../_internal/utils";
import IterableInfer from "../types/IterableInfer";
import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";

/**
 * The opposite of {@link https://fxts.dev/docs/filter | filter}
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
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
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

  if (isIterable(iterable)) {
    return filter(
      (a) => pipe1(f(a), not),
      iterable as Iterable<IterableInfer<A>>,
    );
  }

  if (isAsyncIterable(iterable)) {
    return filter(
      (a) => pipe1(f(a), not),
      iterable as AsyncIterable<IterableInfer<A>>,
    );
  }

  throw new TypeError("iterable must be type of Iterable or AsyncIterable");
}

export default reject;
