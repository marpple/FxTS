import { isAsyncIterable, isIterable } from "./_internal/utils";
import isArray from "./isArray";
import pipe1 from "./pipe1";
import toArray from "./toArray";
import type IterableInfer from "./types/IterableInfer";
import type ReturnValueType from "./types/ReturnValueType";

/**
 * Returns a new array, sorted according to the comparator `f`, which should accept two values.
 * Unlike `sort`, this function does not mutate the original array.
 *
 * @example
 * ```ts
 * const arr = [3, 4, 1, 2, 5, 2];
 * toSorted((a, b) => a > b, arr); // [1, 2, 2, 3, 4, 5]
 * arr; // [3, 4, 1, 2, 5, 2] - original array is unchanged
 *
 * toSorted((a, b) => a.localeCompare(b), "bcdaef"); // ["a", "b", "c", "d", "e", "f"]
 *
 * // Can be used in a pipeline
 * pipe(
 *   [3, 4, 1, 2, 5, 2],
 *   filter((a) => a % 2 !== 0),
 *   toSorted((a, b) => a > b),
 * ); // [1, 3, 5]
 * ```
 */

function toSorted(f: (a: any, b: any) => unknown, iterable: readonly []): any[];

function toSorted<T>(f: (a: T, b: T) => unknown, iterable: Iterable<T>): T[];

function toSorted<T>(
  f: (a: T, b: T) => unknown,
  iterable: AsyncIterable<T>,
): Promise<T[]>;

function toSorted<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: (a: IterableInfer<T>, b: IterableInfer<T>) => unknown,
): (iterable: T) => ReturnValueType<T, IterableInfer<T>[]>;

function toSorted<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: (a: IterableInfer<T>, b: IterableInfer<T>) => unknown,
  iterable?: T,
):
  | IterableInfer<T>[]
  | Promise<IterableInfer<T>[]>
  | ((iterable: T) => ReturnValueType<T, IterableInfer<T>[]>) {
  if (iterable === undefined) {
    return (iterable: T) => {
      // @ts-expect-error - Type narrowing needed for curried function
      return toSorted(f, iterable) as ReturnValueType<T, IterableInfer<T>[]>;
    };
  }

  if (isArray(iterable)) {
    // Check if native toSorted is available (ES2023+)
    // Note: Array.prototype.toSorted is not in TypeScript lib types until TS 5.2+
    // @ts-expect-error - toSorted is available in ES2023 but not in current lib types
    if (typeof Array.prototype.toSorted === "function") {
      // @ts-expect-error - toSorted is available in ES2023 but not in current lib types
      return iterable.toSorted(f);
    }
    // Fallback: create a copy and sort it
    const result = Array.from(iterable) as IterableInfer<T>[];
    // @ts-expect-error - sort expects (a, b) => number but f returns unknown
    return result.sort(f);
  }

  if (isIterable(iterable)) {
    return pipe1(toArray(iterable as Iterable<IterableInfer<T>>), (arr) => {
      // @ts-expect-error - sort expects (a, b) => number but f returns unknown
      return arr.sort(f);
    });
  }

  if (isAsyncIterable(iterable)) {
    return pipe1(
      toArray(iterable as AsyncIterable<IterableInfer<T>>),
      (arr) => {
        // @ts-expect-error - sort expects (a, b) => number but f returns unknown
        return arr.sort(f);
      },
    );
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default toSorted;
