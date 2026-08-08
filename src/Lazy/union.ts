import type IterableInfer from "../types/IterableInfer";
import concat from "./concat";
import uniq from "./uniq";

/**
 * Returns Iterable/AsyncIterable of the union of the two given iterables -
 * the elements of `iterable1` followed by the elements of `iterable2` that
 * have not appeared yet, with duplicates removed.
 *
 * @example
 * ```ts
 * const iter = union([1, 2], [2, 3, 4]);
 * iter.next(); // {value: 1, done: false}
 * iter.next(); // {value: 2, done: false}
 * iter.next(); // {value: 3, done: false}
 * iter.next(); // {value: 4, done: false}
 * iter.next(); // {value: undefined, done: true}
 *
 * // with pipe
 * pipe(
 *   [2, 3, 4],
 *   union([1, 2]),
 *   toArray,
 * ); // [1, 2, 3, 4]
 * ```
 */
function union<T>(
  iterable1: Iterable<T>,
  iterable2: Iterable<T>,
): IterableIterator<T>;

function union<T>(
  iterable1: AsyncIterable<T>,
  iterable2: Iterable<T>,
): AsyncIterableIterator<T>;

function union<T>(
  iterable1: Iterable<T>,
  iterable2: AsyncIterable<T>,
): AsyncIterableIterator<T>;

function union<T>(
  iterable1: AsyncIterable<T>,
  iterable2: AsyncIterable<T>,
): AsyncIterableIterator<T>;

function union<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B extends Iterable<unknown> | AsyncIterable<unknown>,
>(
  iterable1: A,
): (
  iterable2: B,
) => A extends AsyncIterable<unknown>
  ? AsyncIterableIterator<IterableInfer<B>>
  : B extends AsyncIterable<unknown>
  ? AsyncIterableIterator<IterableInfer<B>>
  : IterableIterator<IterableInfer<B>>;

function union<T>(
  iterable1: Iterable<T> | AsyncIterable<T>,
  iterable2?: Iterable<T> | AsyncIterable<T>,
):
  | IterableIterator<T>
  | AsyncIterableIterator<T>
  | ((
      iterable2: Iterable<T> | AsyncIterable<T>,
    ) => IterableIterator<T> | AsyncIterableIterator<T>) {
  if (iterable2 === undefined) {
    return (iterable2: any) => {
      return union(iterable1 as any, iterable2);
    };
  }

  return uniq(concat(iterable1 as any, iterable2 as any)) as
    | IterableIterator<T>
    | AsyncIterableIterator<T>;
}

export default union;
