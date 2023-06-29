import { isAsyncIterable, isIterable } from "./_internal/utils";
import peek from "./Lazy/peek";
import pipe from "./pipe";
import sum from "./sum";
import type ReturnValueType from "./types/ReturnValueType";

/**
 * Returns the average of the given (Iterable/AsyncIterable) (mean)
 *
 * @example
 * ```ts
 * average([]); // NaN
 * average([1, 2, 3, 4, 5]); // 3
 * await average(toAsync([1, 2, 3, 4, 5])); // 3
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3, 4, 5],
 *  average,
 * ); // 3
 * ```
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}
 */
function average<T extends Iterable<number> | AsyncIterable<number>>(
  iterable: T,
): ReturnValueType<T> {
  let size = 0;

  if (isIterable<number>(iterable)) {
    return pipe(
      iterable,
      peek(() => size++),
      sum,
      (a) => (size === 0 ? NaN : a / size),
    ) as ReturnValueType<T>;
  }

  if (isAsyncIterable<number>(iterable)) {
    return pipe(
      iterable,
      peek(() => size++),
      sum,
      (a) => (size === 0 ? NaN : a / size),
    ) as ReturnValueType<T>;
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default average;
