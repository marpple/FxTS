import tap from "../tap";
import map from "./map";
import { isAsyncIterable, isIterable } from "../_internal/utils";
import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import IterableInfer from "../types/IterableInfer";

/**
 * Iterate over an input list,
 * calling a provided `f` for each element in the Iterable/AsyncIterable.
 * Use it when you want to create an effect inside `pipe`.
 *
 * @example
 * ```ts
 * const iter = peek(a => console.log(a), [1, 2, 3, 4]);
 * iter.next() // {done:false, value: 1} // log 1
 * iter.next() // {done:false, value: 2} // log 2
 * iter.next() // {done:false, value: 3} // log 3
 * iter.next() // {done:false, value: 4} // log 4
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3, 4],
 *  peek(a => console.log(a)),
 *  toArray,
 * ); // [1, 2, 3, 4] // log 1,2,3,4
 *
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4]),
 *  peek(a => console.log(a)),
 *  toArray,
 * ); // [1, 2, 3, 4] // log 1,2,3,4
 *
 * // if you want to use asynchronous callback
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4]),
 *  toAsync,
 *  peek(async (a) => console.log(a)),
 *  toArray,
 * ); // [1, 2, 3, 4] // log 1,2,3,4
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3), Promise.resolve(4)],
 *  toAsync,
 *  peek(a => console.log(a)),
 *  toArray,
 * ); // [1, 2, 3, 4] // log 1,2,3,4
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-peek-xm1jh | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
// prettier-ignore
function peek<T>(
  f: (a: T) => unknown, iterable: Iterable<T>
): IterableIterator<T>;

function peek<T>(
  f: (a: T) => unknown,
  iterable: AsyncIterable<T>,
): AsyncIterableIterator<T>;

function peek<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: (a: IterableInfer<T>) => unknown,
): (iterable: T) => ReturnIterableIteratorType<T>;

function peek<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: (a: IterableInfer<T>) => unknown,
  iterable?: T,
):
  | IterableIterator<IterableInfer<T>>
  | AsyncIterableIterator<IterableInfer<T>>
  | ((iterable: T) => ReturnIterableIteratorType<T>) {
  if (iterable === undefined) {
    return (iterable: T) => {
      return peek(f, iterable as any) as ReturnIterableIteratorType<T>;
    };
  }

  if (isIterable(iterable)) {
    return map(
      tap(f),
      iterable as Iterable<IterableInfer<T>>,
    ) as ReturnIterableIteratorType<T, IterableInfer<T>>;
  }

  if (isAsyncIterable(iterable)) {
    return map(
      tap(f),
      iterable as AsyncIterable<IterableInfer<T>>,
    ) as ReturnIterableIteratorType<T, IterableInfer<T>>;
  }

  throw new TypeError("iterable must be type of Iterable or AsyncIterable");
}

export default peek;
