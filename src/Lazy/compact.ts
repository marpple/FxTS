import IterableInfer from "../types/IterableInfer";
import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import { isAsyncIterable, isIterable, isNotNullable } from "../_internal/utils";
import filter from "./filter";

/**
 * Returns Iterable/AsyncIterable with all `null` `undefined` values removed.
 *
 * @example
 * ```ts
 * const iter = compact([0, 1, undefined, 3, null]);
 * iter.next() // {done:false, value: 0}
 * iter.next() // {done:false, value: 1}
 * iter.next() // {done:false, value: 3}
 * iter.next() // {done:true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  [0, 1, undefined, 3, null],
 *  compact,
 *  toArray,
 * ); // [0, 1, 3]
 *
 * await pipe(
 *  Promise.resolve([0, 1, undefined, 3, null]),
 *  compact,
 *  toArray,
 * ); // [0, 1, 3]
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(0), Promise.resolve(1), Promise.resolve(undefined),
 *    Promise.resolve(3), Promise.resolve(null)],
 *  toAsync,
 *  compact,
 *  toArray,
 * ); // [0, 1, 3]
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-compact-lnvmd | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
function compact<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  iterable: T,
): ReturnIterableIteratorType<T, NonNullable<IterableInfer<T>>>;

function compact<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  iterable: T,
) {
  if (isIterable(iterable)) {
    return filter(isNotNullable, iterable);
  }

  if (isAsyncIterable(iterable)) {
    return filter(isNotNullable, iterable);
  }

  throw new TypeError("iterable must be type of Iterable or AsyncIterable");
}

export default compact;
