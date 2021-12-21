import toArray from "./toArray";
import isArray from "./isArray";
import isString from "./isString";
import IterableInfer from "./types/IterableInfer";
import { isAsyncIterable, isIterable } from "./_internal/utils";

type ReturnReverseType<
  T extends Iterable<unknown> | AsyncIterable<unknown> | string,
> = T extends string
  ? string
  : T extends Iterable<unknown>
  ? IterableInfer<T>[]
  : T extends AsyncIterable<unknown>
  ? Promise<IterableInfer<T>[]>
  : never;

function stringReverse(str: string) {
  const arr = Array.from(str);
  let res = "";
  for (let i = arr.length - 1; i >= 0; i--) {
    res += arr[i];
  }
  return res;
}

function sync<T>(iterable: Iterable<T>) {
  const arr = toArray(iterable);
  const res = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    res.push(arr[i]);
  }
  return res;
}

async function async<T>(iterable: AsyncIterable<T>) {
  const arr = await toArray(iterable);
  const res = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    res.push(arr[i]);
  }
  return res;
}

/**
 * Returns the given elements in reverse order.
 *
 * @example
 * ```ts
 * reverse([1, 2, 3, 4, 5]); // [5, 4, 3, 2, 1]
 * reverse("abcde"); // "edcba"
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3, 4, 5],
 *  reverse,
 * ); // [5, 4, 3, 2, 1]
 *
 * pipe(
 *  "abcde",
 *  reverse,
 * ); // "edcba"
 *
 * await pipe(
 *  [1, 2, 3, 4, 5],
 *  toAsync,
 *  reverse,
 * ); // [5, 4, 3, 2, 1]
 *
 * await pipe(
 *  "abcde",
 *  toAsync,
 *  reverse,
 * ); // ["e", "d", "c", "b", "a"]
 * ```
 */
function reverse<T extends Iterable<unknown> | AsyncIterable<unknown> | string>(
  iterable: T,
): ReturnReverseType<T>;
function reverse<T>(
  iterable: string | number[] | Iterable<T> | AsyncIterable<T>,
) {
  if (isArray(iterable)) {
    return iterable.reverse();
  }

  if (isString(iterable)) {
    return stringReverse(iterable);
  }

  if (isIterable(iterable)) {
    return sync(iterable);
  }

  if (isAsyncIterable(iterable)) {
    return async(iterable);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default reverse;
