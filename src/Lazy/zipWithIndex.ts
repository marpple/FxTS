import map from "./map";
import concurrent, { isConcurrent } from "./concurrent";
import { isAsyncIterable, isIterable } from "../_internal/utils";
import type ReturnZipWithIndexType from "../types/ReturnZipWithIndexType";

function _zipWithIndex<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  iterable: T,
): ReturnZipWithIndexType<T> {
  let i = -1;

  return map((a) => [++i, a], iterable as any) as any;
}

function async<T>(iterable: AsyncIterable<T>) {
  let _iterator: AsyncIterator<[number, T]>;
  return {
    async next(_concurrent: any) {
      if (_iterator === undefined) {
        _iterator = isConcurrent(_concurrent)
          ? _zipWithIndex(concurrent(_concurrent.length, iterable))
          : _zipWithIndex(iterable);
      }
      return _iterator.next(_concurrent);
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

/**
 * Returns Iterable/AsyncIterable including an index to the existing Iterable/AsyncIterable value.
 *
 * @example
 * ```ts
 * const iter = zipWithIndex(["a", "b", "c", "d"]);
 * iter.next() // {done:false, value: [0, "a"]}
 * iter.next() // {done:false, value: [1, "b"]}
 * iter.next() // {done:false, value: [2, "c"]}
 * iter.next() // {done:false, value: [3, "d"]}
 * iter.next() // {done:true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  ["a", "b", "c", "d"],
 *  zipWithIndex,
 *  toArray,
 * ); // [[0, "a"], [1, "b"], [2, "c"], [3, "d"]]
 *
 * await pipe(
 *  Promise.resolve(["a", "b", "c", "d"]),
 *  zipWithIndex,
 *  toArray,
 * ); // [[0, "a"], [1, "b"], [2, "c"], [3, "d"]]
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve("a"), Promise.resolve("b"), Promise.resolve("c"), Promise.resolve("d")],
 *  toAsync,
 *  zipWithIndex,
 *  toArray,
 * ); // [[0, "a"], [1, "b"], [2, "c"], [3, "d"]]
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-zipwithindex-p1k31 | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
function zipWithIndex<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  iterable: T,
): ReturnZipWithIndexType<T>;

function zipWithIndex<T>(
  iterable: Iterable<T> | AsyncIterable<T>,
): IterableIterator<[number, T]> | AsyncIterableIterator<[number, T]> {
  if (isAsyncIterable(iterable)) {
    return async(iterable);
  }
  if (isIterable(iterable)) {
    return _zipWithIndex(iterable);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default zipWithIndex;
