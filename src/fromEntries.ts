import { isAsyncIterable, isIterable } from "./_internal/utils";
import reduce from "./reduce";
import type IterableInfer from "./types/IterableInfer";
import type Key from "./types/Key";
import type ReturnValueType from "./types/ReturnValueType";

/**
 * Returns an object from string keyed-value pairs.
 *
 * @example
 * ```ts
 * const arr = [
 *     ["a", 1],
 *     ["b", true],
 *     ["c", "hello"],
 *     ["d", { d1: 1, d2: 3 }],
 * ] as (
 *     | ["a", number]
 *     | ["b", boolean]
 *     | ["c", string]
 *     | ["d", { d1: number, d2: number; }]
 * )[];
 * fromEntries(arr); // { a: 1, b: true, c: 'hello', d: { d1: 1, d2: 3 } }
 * ```
 *
 *
 * see {@link https://fxts.dev/api/entries | entries}
 */

function fromEntries<
  U extends [Key, any] | readonly [Key, any],
  T extends Iterable<U> | AsyncIterable<U>,
>(
  iterable: T,
): ReturnValueType<
  T,
  {
    [K in IterableInfer<T> as K[0]]: K[1];
  }
>;
function fromEntries<T extends [Key, any]>(
  iter: Iterable<T> | AsyncIterable<T>,
) {
  const obj: Record<Key, any> = {};
  const reducer = (obj: Record<Key, any>, [key, val]: T): Record<Key, any> => {
    obj[key] = val;
    return obj;
  };
  if (isAsyncIterable(iter)) {
    return reduce(reducer, obj, iter);
  } else if (isIterable(iter)) {
    return reduce(reducer, obj, iter);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default fromEntries;
