import { isAsyncIterable, isIterable } from "./_internal/utils";
import isArray from "./isArray";
import pipe1 from "./pipe1";
import toArray from "./toArray";
import type IterableInfer from "./types/IterableInfer";
import type ReturnValueType from "./types/ReturnValueType";

/**
 * Returns an array, sorted according to the comparator `f`, which should accept two values
 *
 * @example
 * ```ts
 * sort((a, b) => a > b, [3, 4, 1, 2, 5, 2]); // [1, 2, 2, 3, 4, 5]
 * sort((a, b) => a > b, 'bcdaef); // ["a", "b", "c", "d", "e", "f"]
 * ```
 */
// prettier-ignore
function sort(
    f: (a: any, b: any) => unknown,
    iterable: readonly []
): any[];

// prettier-ignore
function sort<T>(
  f: (a: T, b: T) => unknown,
  iterable: Iterable<T>
): T[];

function sort<T>(
  f: (a: T, b: T) => unknown,
  iterable: AsyncIterable<T>,
): Promise<T[]>;

function sort<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: (a: IterableInfer<T>, b: IterableInfer<T>) => unknown,
): (iterable: T) => ReturnValueType<T, IterableInfer<T>[]>;

function sort<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: (a: IterableInfer<T>, b: IterableInfer<T>) => unknown,
  iterable?: T,
):
  | IterableInfer<T>[]
  | Promise<IterableInfer<T>[]>
  | ((iterable: T) => ReturnValueType<T, IterableInfer<T>[]>) {
  if (iterable === undefined) {
    return (iterable: T) => {
      return sort(f, iterable as any) as ReturnValueType<T, IterableInfer<T>[]>;
    };
  }

  if (isArray(iterable)) {
    return (iterable as any[]).sort(f as any);
  }

  if (isIterable(iterable)) {
    return pipe1(toArray(iterable as Iterable<IterableInfer<T>>), (arr) =>
      arr.sort(f as any),
    );
  }

  if (isAsyncIterable(iterable)) {
    return pipe1(toArray(iterable as AsyncIterable<IterableInfer<T>>), (arr) =>
      arr.sort(f as any),
    );
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default sort;
