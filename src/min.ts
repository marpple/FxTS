import ReturnValueType from "./types/ReturnValueType";
import { UniversalIterable } from "./types/Utils";
import { isAsyncIterable, isIterable } from "./_internal/utils";

function sync(iterable: Iterable<number>) {
  let n = NaN;
  for (const a of iterable) {
    if (Number.isNaN(a)) {
      return a;
    } else if (a < n || Number.isNaN(n)) {
      n = a;
    }
  }

  if (Number.isNaN(n)) {
    return Infinity;
  }

  return n;
}

async function async(iterable: AsyncIterable<number>) {
  let n = NaN;
  for await (const a of iterable) {
    if (Number.isNaN(a)) {
      return a;
    } else if (a < n || Number.isNaN(n)) {
      n = a;
    }
  }

  if (Number.isNaN(n)) {
    return Infinity;
  }

  return n;
}

/**
 * Returns the smallest of the given iterable/AsyncIterable
 *
 * @example
 * ```ts
 * min([1, 3, 5]); // 1;
 * min([1, NaN, 2]); // NaN;
 * min([1, Infinity, 3]); // 1;
 * min([1, -Infinity, 3]); // -Infinity;
 * min([]); // Infinity
 * ```
 */
function min<A extends UniversalIterable<number>>(
  iterable: A,
): ReturnValueType<A, number>;

function min(iterable: UniversalIterable<number>) {
  if (isIterable(iterable)) {
    return sync(iterable);
  } else if (isAsyncIterable(iterable)) {
    return async(iterable);
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default min;
