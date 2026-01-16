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
// prettier-ignore
function toSorted(
    f: (a: any, b: any) => unknown,
    iterable: readonly []
): any[];

// prettier-ignore
function toSorted<T>(
  f: (a: T, b: T) => unknown,
  iterable: Iterable<T>
): T[];

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
      return toSorted(f, iterable as any) as ReturnValueType<
        T,
        IterableInfer<T>[]
      >;
    };
  }

  if (isArray(iterable)) {
    // Check if native toSorted is available (ES2023+)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const arrayProto = Array.prototype as any;
    if (typeof arrayProto.toSorted === "function") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (iterable as any).toSorted(f as any);
    }
    // Fallback: create a copy and sort it
    const result = Array.from(iterable as any[]);
    return result.sort(f as any);
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

export default toSorted;
