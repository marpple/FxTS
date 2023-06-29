import { isAsyncIterable, isIterable } from "./_internal/utils";
import head from "./head";
import filter from "./Lazy/filter";
import type IterableInfer from "./types/IterableInfer";
import type ReturnValueType from "./types/ReturnValueType";

/**
 * Looks through each value in Iterable/AsyncIterable, returning the first one that passes a truth test `f`,
 * or `undefined` if no value passes the test.
 *
 * @example
 * ```ts
 * find((a) => a === 2, [1, 2, 3, 4]); // 2
 *
 * find((a) => a === "r", "marpple"); // 'r'
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-find-uhl0o | Try It}
 */
function find<T>(f: (a: T) => unknown, iterable: Iterable<T>): T | undefined;

function find<T>(
  f: (a: T) => unknown,
  iterable: AsyncIterable<T>,
): Promise<T | undefined>;

function find<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: (a: IterableInfer<T>) => unknown,
  iterable?: T,
): (iterable: T) => ReturnValueType<T, IterableInfer<T> | undefined>;

function find<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: (a: IterableInfer<T>) => unknown,
  iterable?: T,
):
  | (IterableInfer<T> | undefined)
  | Promise<IterableInfer<T> | undefined>
  | ((iterable: T) => ReturnValueType<T, IterableInfer<T> | undefined>) {
  if (iterable === undefined) {
    return (iterable: T) =>
      find(f, iterable) as ReturnValueType<T, IterableInfer<T> | undefined>;
  }
  if (isIterable<IterableInfer<T>>(iterable)) {
    return head(filter(f, iterable));
  }
  if (isAsyncIterable<IterableInfer<T>>(iterable)) {
    return head(filter(f, iterable));
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default find;
