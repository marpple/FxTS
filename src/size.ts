import each from "./each";
import ReturnValueType from "./types/ReturnValueType";
import { isAsyncIterable, isIterable } from "./_internal/utils";

function sync<A extends Iterable<unknown>>(iterable: A) {
  let a = 0;
  each(() => a++, iterable);
  return a;
}

async function async<A extends AsyncIterable<unknown>>(iterable: A) {
  let a = 0;
  await each(() => a++, iterable);
  return a;
}

/**
 * Returns the size of Iterable/AsyncIterable
 *
 * @example
 * ```ts
 * size([1, 2, 3, 4]); // 4
 * size("abcde"); // 5
 *
 * await size(toAsync([1, 2, 3, 4])); // 4
 * ```
 */
function size<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  iterable: A,
): ReturnValueType<A, number>;

function size<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  iterable: A,
) {
  if (isIterable(iterable)) {
    return sync(iterable);
  }

  if (isAsyncIterable(iterable)) {
    return async(iterable);
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default size;
