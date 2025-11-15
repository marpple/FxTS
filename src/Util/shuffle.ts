import { createSeededRandom } from "../_internal/seededRandom";
import { isAsyncIterable, isIterable } from "../_internal/utils";
import isArray from "../isArray";
import pipe1 from "../pipe1";
import toArray from "../toArray";
import type ReturnArrayType from "../types/ReturnArrayType";

/**
 * Returns a new array with the elements of the input array shuffled randomly using Fisher-Yates algorithm.
 *
 * @example
 * ```ts
 * shuffle([1, 2, 3, 4, 5]); // [3, 1, 5, 2, 4] (random order)
 * shuffle("hello"); // ["o", "e", "l", "h", "l"] (random order) Only ASCII codes are shuffled in the case of a string.
 * shuffle([1, 2, 3, 4, 5], 42); // [2, 4, 1, 5, 3] (deterministic with seed 42)
 * ```
 */
function shuffle<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  iterable: T,
  seed?: number,
): ReturnArrayType<T>;

function shuffle<T>(iterable: Iterable<T> | AsyncIterable<T>, seed?: number) {
  const random = seed !== undefined ? createSeededRandom(seed) : Math.random;

  if (isArray(iterable)) {
    const result = toArray(iterable) as T[];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  if (isIterable(iterable)) {
    return pipe1(toArray(iterable), (arr) => {
      const result = arr;
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    });
  }

  if (isAsyncIterable(iterable)) {
    return pipe1(toArray(iterable), (arr) => {
      const result = arr;
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    });
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default shuffle;
