import IterableInfer from "./types/IterableInfer";
import Key from "./types/Key";
import ReturnValueType from "./types/ReturnValueType";
import { isAsyncIterable, isIterable } from "./_internal/utils";

async function async<T extends [Key, any]>(
  iterable: AsyncIterable<T>,
): Promise<{
  [K in T as K[0]]: K[1];
}> {
  const a = {} as any;
  for await (const i of iterable) {
    a[i[0]] = i[1];
  }
  return a;
}

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
 * see {@link https://fxts.dev/docs/entries | entries}
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
  if (isAsyncIterable(iter)) {
    return async(iter);
  } else if (isIterable(iter)) {
    return [...iter].reduce((obj, [key, val]) => {
      obj[key] = val;
      return obj;
    }, {} as any);
  }
  return {} as {
    [K in T as K[0]]: K[1];
  };
}

export default fromEntries;
