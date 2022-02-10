import IterableInfer from "../types/IterableInfer";
import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import { UniversalIterable, UniversalIterator } from "../types/Utils";
import { isAsyncIterable, isIterable } from "../_internal/utils";
import concurrent, { isConcurrent } from "./concurrent";

function* sync<T>(iterable: Iterable<T>): IterableIterator<T> {
  const arr = [];
  for (const a of iterable) {
    yield a;
    arr.push(a);
  }

  while (arr.length) {
    for (const a of arr) {
      yield a;
    }
  }
}

async function* asyncSequential<T>(
  iterable: AsyncIterable<T>,
): AsyncIterableIterator<T> {
  const arr = [];
  for await (const a of iterable) {
    yield a;
    arr.push(a);
  }

  while (arr.length) {
    for (const a of arr) {
      yield a;
    }
  }
}

function async<T>(iterable: AsyncIterable<T>): AsyncIterableIterator<T> {
  let _iterator: AsyncIterator<T>;
  return {
    async next(_concurrent: any) {
      if (_iterator === undefined) {
        _iterator = isConcurrent(_concurrent)
          ? asyncSequential(concurrent(_concurrent.length, iterable))
          : asyncSequential(iterable);
      }
      return _iterator.next(_concurrent);
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

/**
 * Returns Iterable/AsyncIterable that infinitely repeats the given Iterable/AsyncIterable
 *
 * @example
 * ```ts
 * const iter = cycle("abc")
 * iter.next(); // {value:"a", done: false}
 * iter.next(); // {value:"b", done: false}
 * iter.next(); // {value:"c", done: false}
 * iter.next(); // {value:"a", done: false}
 * iter.next(); // {value:"b", done: false}
 *
 * // with pipe
 * pipe(
 *   cycle([1,2,3,4]),
 *   take(5),
 *   toArray,
 * ); // [1,2,3,4,1]
 * ```
 */
function cycle<A extends UniversalIterable<unknown>>(
  iter: A,
): ReturnIterableIteratorType<A>;

function cycle<T extends UniversalIterable<unknown>>(
  iterable: T,
): UniversalIterator<IterableInfer<T>> {
  if (isIterable<IterableInfer<T>>(iterable)) {
    return sync(iterable);
  }
  if (isAsyncIterable<IterableInfer<T>>(iterable)) {
    return async(iterable);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default cycle;
