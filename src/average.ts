import peek from "./Lazy/peek";
import pipe from "./pipe";
import sum from "./sum";
import ReturnValueType from "./types/ReturnValueType";
import { isAsyncIterable, isIterable } from "./_internal/utils";

/**
 * Returns the average of the given (Iterable/AsyncIterable) (mean)
 *
 * @example
 * ```ts
 * average([1, 2, 3, 4, 5]); // 6
 * await average(toAsync([1, 2, 3, 4, 5])); // 6
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3, 4, 5],
 *  average,
 * ); // 6
 * ```
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}
 */
function average<T extends Iterable<number> | AsyncIterable<number>>(
  iterable: T,
): ReturnValueType<T> {
  let size = 0;

  if (isIterable(iterable)) {
    return pipe(
      iterable as Iterable<number>,
      peek(() => size++),
      sum,
      (a) => (size === 0 ? NaN : a / size),
    ) as ReturnValueType<T>;
  }

  if (isAsyncIterable(iterable)) {
    return pipe(
      iterable as AsyncIterable<number>,
      peek(() => size++),
      sum,
      (a) => (size === 0 ? NaN : a / size),
    ) as ReturnValueType<T>;
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default average;
