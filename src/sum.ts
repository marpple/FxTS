import add from "./add";
import reduce from "./reduce";
import ReturnValueType from "./types/ReturnValueType";
import { isAsyncIterable, isIterable } from "./_internal/utils";

/**
 * Adds all the elements of a Iterable/AsyncIterable.
 *
 * @example
 * ```ts
 * sum([1, 2, 3, 4]); // 10
 * sum(['a', 'b', 'c']); // 'abc'
 * await sum(toAsync([1, 2, 3, 4])); // 10
 * await sum(toAsync(['a', 'b', 'c'])); // 'abc'
 * ```
 */
function sum<
  A extends
    | Iterable<number>
    | AsyncIterable<number>
    | Iterable<string>
    | AsyncIterable<string>,
>(iterable: A): ReturnValueType<A> {
  if (isIterable(iterable)) {
    return reduce(add, iterable) as ReturnValueType<A>;
  }

  if (isAsyncIterable(iterable)) {
    return reduce(add, iterable) as ReturnValueType<A>;
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default sum;
