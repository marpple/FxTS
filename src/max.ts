import type ReturnValueType from "./types/ReturnValueType";
import { isAsyncIterable, isIterable } from "./_internal/utils";

function sync(iterable: Iterable<number>) {
  let n = NaN;
  for (const a of iterable) {
    if (Number.isNaN(a)) {
      return a;
    } else if (a > n || Number.isNaN(n)) {
      n = a;
    }
  }

  if (Number.isNaN(n)) {
    return -Infinity;
  }

  return n;
}

async function async(iterable: AsyncIterable<number>) {
  let n = NaN;
  for await (const a of iterable) {
    if (Number.isNaN(a)) {
      return a;
    } else if (a > n || Number.isNaN(n)) {
      n = a;
    }
  }

  if (Number.isNaN(n)) {
    return -Infinity;
  }

  return n;
}

/**
 * Returns the largest of the given iterable/AsyncIterable
 *
 * @example
 * ```ts
 * max([1, 3, 5]); // 5;
 * max([1, NaN, 2]); // NaN;
 * max([1, Infinity, 2]); // Infinity;
 * max([]); // -Infinity
 * ```
 */
function max<A extends Iterable<number> | AsyncIterable<number>>(
  iterable: A,
): ReturnValueType<A, number>;

function max(iterable: Iterable<number> | AsyncIterable<number>) {
  if (isIterable(iterable)) {
    return sync(iterable);
  } else if (isAsyncIterable(iterable)) {
    return async(iterable);
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default max;
