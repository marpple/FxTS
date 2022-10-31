import add from "./add";
import reduce from "./reduce";
import { isAsyncIterable, isIterable } from "./_internal/utils";

/**
 * Adds all the elements of a Iterable/AsyncIterable.
 *
 * @example
 * ```ts
 * sum([1, 2, 3, 4]); // 10
 * await sum(toAsync([1, 2, 3, 4])); // 10
 * ```
 */
function sum<A extends Iterable<number> | AsyncIterable<number>>(
  iterable: A,
): A extends Iterable<number>
  ? number
  : A extends AsyncIterable<number>
  ? Promise<number>
  : never;
function sum<A extends Iterable<number> | AsyncIterable<number>>(
  iterable: A,
): number | Promise<number> {
  if (Array.isArray(iterable)) {
    return iterable.reduce(add, 0);
  } else if (isIterable(iterable)) {
    return reduce<number, number>((a, b) => add(a, b), 0, iterable);
  } else if (isAsyncIterable(iterable)) {
    return reduce<number, number>(add, Promise.resolve(0), iterable);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default sum;
