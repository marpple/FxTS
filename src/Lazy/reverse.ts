import toArray from "../toArray";
import isArray from "../isArray";
import isString from "../isString";
import { isAsyncIterable, isIterable } from "../_internal/utils";
import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import concurrent, { isConcurrent } from "./concurrent";

function* sync<T>(iterable: Iterable<T>) {
  const arr =
    isArray(iterable) || isString(iterable) ? iterable : toArray(iterable);
  for (let i = arr.length - 1; i >= 0; i--) {
    yield arr[i];
  }
}

async function* asyncSequential<T>(iterable: AsyncIterable<T>) {
  const arr = await toArray(iterable);
  for (let i = arr.length - 1; i >= 0; i--) {
    yield arr[i];
  }
}

function async<T>(iterable: AsyncIterable<T>): AsyncIterableIterator<T> {
  let iterator: AsyncIterator<T>;
  return {
    [Symbol.asyncIterator]() {
      return this;
    },

    async next(_concurrent: any) {
      if (iterator === undefined) {
        iterator = isConcurrent(_concurrent)
          ? asyncSequential(concurrent(_concurrent.length, iterable))
          : asyncSequential(iterable);
      }

      return iterator.next(_concurrent);
    },
  };
}

/**
 * Returns Iterable/AsyncIterable of the given elements in reverse order.
 * Note:Evaluates all Iterable, except for array, and returns a lazy-reversed iterator.
 *
 * @example
 * ```ts
 * const iter1 = reverse([1, 2, 3]);
 * iter1.next(); // {value: 3, done: false}
 * iter1.next(); // {value: 2, done: false}
 * iter1.next(); // {value: 1, done: false}
 * iter1.next(); // {value: undefined, done: true}
 *
 * const iter2 = reverse("abc");
 * iter2.next(); // {value: "c", done: false}
 * iter2.next(); // {value: "b", done: false}
 * iter2.next(); // {value: "a", done: false}
 * iter2.next(); // {value: undefined, done: true}
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3, 4, 5],
 *  reverse,
 *  toArray,
 * ); // [5, 4, 3, 2, 1]
 *
 * pipe(
 *  "abcde",
 *  reverse,
 *  toArray,
 * ); // "edcba"
 * ```
 *
 * see {@link https://fxts.dev/docs/pipe | pipe} {@link https://fxts.dev/docs/toArray | toArray}
 */
function reverse<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  iterable: T,
): ReturnIterableIteratorType<T>;

function reverse<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  iterable: T,
) {
  if (isIterable(iterable)) {
    return sync(iterable);
  }

  if (isAsyncIterable(iterable)) {
    return async(iterable);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default reverse;
