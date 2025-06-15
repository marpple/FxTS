import { isAsyncIterable, isIterable, toIterator } from "../_internal/utils";
import isUndefined from "../isUndefined";
import max from "../max";
import nth from "../nth";
import pipe from "../pipe";
import size from "../size";
import toArray from "../toArray";
import type ReturnZipType from "../types/ReturnZipType";
import type { UniversalIterable } from "../types/Utils";
import filter from "./filter";
import map from "./map";
import toAsync from "./toAsync";

function* sync(
  iterable: Iterable<Iterable<unknown>>,
): IterableIterator<Iterable<unknown>> {
  const maxLen = pipe(iterable, map(size), max);

  for (let index = 0; index < maxLen; index++) {
    yield pipe(
      iterable,
      map(nth(index)),
      filter((value) => !isUndefined(value)),
      toArray,
    );
  }
}

function async(
  iterable: Iterable<UniversalIterable>,
): AsyncIterableIterator<UniversalIterable> {
  const iterators = toArray(map(toIterator, iterable as any));

  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next(_concurrent) {
      const headIterators = await pipe(
        toAsync(iterators),
        map((iterator) => iterator.next(_concurrent)),
        toArray,
      );

      const done = headIterators.every(({ done }) => done);

      if (done) return { done: true, value: undefined };

      return {
        done: false,
        value: pipe(
          headIterators,
          map(({ value }) => value),
          filter((value) => !isUndefined(value)),
          toArray,
        ),
      };
    },
  };
}

/**
 * The transpose function takes multiple iterators as input and returns a transposed 2D array—swapping rows with columns.
 *
 * Unlike the existing zip function, transpose behaves as shown in the example below:
 *
 * @example
 * ```ts
 * const iter = transpose([1, 'a'], [2, 'b'], [3, 'c']);
 * iter.next() // {done:false, value: [1, 2, 3]}
 * iter.next() // {done:false, value: ['a', 'b', 'c']}
 * iter.next() // {done:true, value: undefined}
 *
 * const iter = transpose([1, 2, 3], ['a', 'b', 'c']);
 * iter.next() // {done:false, value: [1, 'a']}
 * iter.next() // {done:false, value: [2, 'b']}
 * iter.next() // {done:false, value: [3, 'c']}
 * iter.next() // {done:true, value: undefined}
 *
 * // How transpose differs from `zip`
 * const iter = zip([1, 2], [3], [], [4, 5, 6], [7], [8, 9]);
 * iter.next() // {done:true, value: undefined}
 * // Because zip stops at the shortest input, passing an empty array causes it to exit immediately.
 *
 * // with pipe
 * pipe(
 *   [4, 5, 6, 7],
 *   transpose([1, 2, 3]),
 *   toArray,
 * ) // [[ 1, 4 ], [ 2, 5 ], [ 3, 6 ], [7]]
 *
 * pipe(
 *   Promise.resolve([4, 5, 6, 7]),
 *   transpose([1, 2, 3]),
 *   toArray,
 * ) // [[ 1, 4 ], [ 2, 5 ], [ 3, 6 ], [7]]
 *
 * // with toAsync
 * pipe(
 *   [Promise.resolve(4), Promise.resolve(5), Promise.resolve(6), Promise.resolve(7)],
 *   toAsync,
 *   transpose([1, 2, 3]),
 *   toArray,
 * ) // [[ 1, 4 ], [ 2, 5 ], [ 3, 6 ], [7]]
 * ```
 */

function transpose<T extends UniversalIterable, R extends UniversalIterable[]>(
  iterables: T,
): (...args: R) => ReturnZipType<[T, ...R]>;
function transpose<T extends UniversalIterable[]>(
  ...args: T
): ReturnZipType<[...T]>;

function transpose<R extends UniversalIterable[]>(...iterables: R[]) {
  if (size(iterables) < 2)
    return (...args: UniversalIterable[]) =>
      transpose(...iterables, ...args) as ReturnZipType<R>;

  if (
    iterables.some((value) => !isIterable(value) && !isAsyncIterable(value))
  ) {
    throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
  }

  const hasAsyncIterable = iterables.some((iterable) =>
    isAsyncIterable(iterable),
  );

  if (hasAsyncIterable) {
    return async(iterables) as ReturnZipType<R>;
  }

  return sync(iterables);
}

export default transpose;
