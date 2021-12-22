import add from "./add";
import reduce from "./reduce";
import IterableInfer from "./types/IterableInfer";
import ReturnValueType from "./types/ReturnValueType";
import { isAsyncIterable, isIterable } from "./_internal/utils";

type ReturnSumType<
  A extends Iterable<number | string> | AsyncIterable<number | string>,
> = ReturnValueType<A, IterableInfer<A>>;

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
  A extends Iterable<number | string> | AsyncIterable<number | string>,
>(iterable: A): ReturnSumType<A> {
  if (isIterable(iterable)) {
    return reduce(add, iterable) as ReturnSumType<A>;
  }

  if (isAsyncIterable(iterable)) {
    return reduce(add, iterable) as ReturnSumType<A>;
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default sum;
