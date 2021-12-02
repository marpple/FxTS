import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import uniqueBy from "./uniqBy";
import { isAsyncIterable, isIterable } from "../_internal/utils";
import identity from "../identity";

/**
 * Returns Iterable/AsyncIterable with duplicate values removed inside the given Iterable/AsyncIterable.
 * Only primitive values can be compared.
 *
 * @example
 * ```ts
 * const iter = uniq([1, 2, 1, 3, 2]);
 * iter.next() // {done:false, value: 1}
 * iter.next() // {done:false, value: 2}
 * iter.next() // {done:false, value: 3}
 * iter.next() // {done:true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  [1, 2, 1, 3],
 *  uniq,
 *  toArray,
 * ); // [1, 2, 3]
 *
 * await pipe(
 *  Promise.resolve([1, 2, 1, 3]),
 *  uniq,
 *  toArray,
 * ); // [1, 2, 3]
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(1), Promise.resolve(3)],
 *  toAsync,
 *  uniq,
 *  toArray,
 * ); // [1, 2, 3]
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-uniq-uljmk | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
function uniq<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  iterable: A,
): ReturnIterableIteratorType<A> {
  if (isIterable(iterable)) {
    return uniqueBy(identity, iterable) as ReturnIterableIteratorType<A>;
  }

  if (isAsyncIterable(iterable)) {
    return uniqueBy(identity, iterable) as ReturnIterableIteratorType<A>;
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default uniq;
