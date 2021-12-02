import filter from "./Lazy/filter";
import head from "./head";
import { isAsyncIterable, isIterable } from "./_internal/utils";
import IterableInfer from "./types/IterableInfer";

type FindReturnType<T extends Iterable<unknown> | AsyncIterable<unknown>> =
  T extends AsyncIterable<infer A>
    ? Promise<A | undefined>
    : T extends Iterable<infer A>
    ? A | undefined
    : never;

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
): (iterable: T) => FindReturnType<T>;

function find<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: (a: IterableInfer<T>) => unknown,
  iterable?: T,
):
  | (IterableInfer<T> | undefined)
  | Promise<IterableInfer<T> | undefined>
  | ((iterable: T) => FindReturnType<T>) {
  if (iterable === undefined) {
    return (iterable: T) => find(f, iterable) as any;
  }
  if (isIterable(iterable)) {
    return head(filter(f, iterable as Iterable<IterableInfer<T>>));
  }
  if (isAsyncIterable(iterable)) {
    return head(filter(f, iterable as AsyncIterable<IterableInfer<T>>));
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default find;
