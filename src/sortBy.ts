import { isAsyncIterable, isIterable } from "./_internal/utils";
import isArray from "./isArray";
import sort from "./sort";
import type IterableInfer from "./types/IterableInfer";
import type ReturnValueType from "./types/ReturnValueType";

/**
 * Returns an array which sorted according to the `f`.
 *
 * @example
 * ```ts
 * sortBy(a => a, [3, 4, 1, 2, 5, 2]);
 * // [1, 2, 2, 3, 4, 5]
 * sortBy((a) => a.id, [{id:4,name:'foo'}, {id:2,name:'bar'},{id:3, name:'lee'}]);
 * // [{id:2,name:'bar'}, {id:3, name:'lee'}, {id:4,name:'foo'}]
 * ```
 */
function sortBy(f: (a: any) => unknown, iterable: readonly []): any[];

function sortBy<T>(f: (a: T) => unknown, iterable: Iterable<T>): T[];

function sortBy<T>(
  f: (a: T) => unknown,
  iterable: AsyncIterable<T>,
): Promise<T[]>;

function sortBy<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: (a: IterableInfer<T>) => unknown,
): (iterable: T) => ReturnValueType<T, IterableInfer<T>[]>;

function sortBy<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: (a: IterableInfer<T>) => unknown,
  iterable?: T,
):
  | IterableInfer<T>[]
  | Promise<IterableInfer<T>[]>
  | ((iterable: T) => ReturnValueType<T, IterableInfer<T>[]>) {
  if (iterable === undefined) {
    return (iterable: T) =>
      sortBy(f, iterable as any) as ReturnValueType<T, IterableInfer<T>[]>;
  }

  const _sortBy = (a: IterableInfer<T>, b: IterableInfer<T>) => {
    const aa = f(a) as number;
    const bb = f(b) as number;
    return aa < bb ? -1 : aa > bb ? 1 : 0;
  };

  if (isArray(iterable)) {
    return (iterable as any).sort(_sortBy);
  }

  if (isIterable(iterable)) {
    return sort(_sortBy, iterable as Iterable<IterableInfer<T>>);
  }

  if (isAsyncIterable(iterable)) {
    return sort(_sortBy, iterable as AsyncIterable<IterableInfer<T>>);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default sortBy;
