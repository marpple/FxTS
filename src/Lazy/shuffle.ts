import { isAsyncIterable, isIterable } from "../_internal/utils";
import isArray from "../isArray";
import isString from "../isString";
import toArray from "../toArray";
import type ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import concurrent, { isConcurrent } from "./concurrent";

function* sync<T>(iterable: Iterable<T>) {
  const arr =
    isArray(iterable) || isString(iterable) ? iterable : toArray(iterable);

  // Fisher-Yates shuffle
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  for (const item of result) {
    yield item;
  }
}

async function* asyncSequential<T>(iterable: AsyncIterable<T>) {
  const arr = await toArray(iterable);

  // Fisher-Yates shuffle
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  for (const item of result) {
    yield item;
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
 * Returns Iterable/AsyncIterable of the given elements in random order using Fisher-Yates algorithm.
 * Note: Evaluates all Iterable and returns a lazy-shuffled iterator.
 *
 * @example
 * ```ts
 * const iter1 = shuffle([1, 2, 3]);
 * iter1.next(); // {value: 2, done: false} (random)
 * iter1.next(); // {value: 1, done: false} (random)
 * iter1.next(); // {value: 3, done: false} (random)
 * iter1.next(); // {value: undefined, done: true}
 *
 * const iter2 = shuffle("abc");
 * iter2.next(); // {value: "c", done: false} (random)
 * iter2.next(); // {value: "a", done: false} (random)
 * iter2.next(); // {value: "b", done: false} (random)
 * iter2.next(); // {value: undefined, done: true}
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3, 4, 5],
 *  shuffle,
 *  toArray,
 * ); // [3, 1, 5, 2, 4] (random order)
 *
 * pipe(
 *  "abcde",
 *  shuffle,
 *  toArray,
 * ); // ["c", "a", "e", "b", "d"] (random order)
 * ```
 *
 * see {@link https://fxts.dev/docs/pipe | pipe} {@link https://fxts.dev/docs/toArray | toArray}
 */
function shuffle<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  iterable: T,
): ReturnIterableIteratorType<T>;

function shuffle<T extends Iterable<unknown> | AsyncIterable<unknown>>(
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

export default shuffle;
