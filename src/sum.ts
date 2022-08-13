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
function sum<A extends readonly []>(iterable: A): 0;
function sum<A extends Iterable<number> | AsyncIterable<number>>(
  iterable: A,
): ReturnValueType<A>;

function sum<A extends Iterable<number> | AsyncIterable<number> | readonly []>(
  iterable: A,
): ReturnValueType<A> | 0 {
  if (isIterable(iterable)) {
    const iterator = iterable[Symbol.iterator]();
    const { done } = iterator.next();
    if (done) {
      return 0;
    }

    return reduce(add, iterable) as ReturnValueType<A>;
  }

  if (isAsyncIterable(iterable)) {
    const iterator = iterable[Symbol.asyncIterator]();
    return iterator.next().then(({ done }) => {
      if (done) {
        return 0;
      }

      return reduce(add, iterable) as ReturnValueType<A>;
    });
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default sum;
