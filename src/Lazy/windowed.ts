import { isAsyncIterable, isIterable } from "../_internal/utils";
import type IterableInfer from "../types/IterableInfer";
import type ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import concurrent, {
  isConcurrent,
  type Concurrent,
  type ConcurrentArg,
} from "./concurrent";

function* sync<T>(size: number, iterable: Iterable<T>): IterableIterator<T[]> {
  const buffer: T[] = [];
  for (const item of iterable) {
    buffer.push(item);
    if (buffer.length === size) {
      yield [...buffer];
      buffer.shift();
    }
  }
}

async function* asyncSequential<T>(
  size: number,
  iterable: AsyncIterable<T>,
): AsyncIterableIterator<T[]> {
  const buffer: T[] = [];
  for await (const item of iterable) {
    buffer.push(item);
    if (buffer.length === size) {
      yield [...buffer];
      buffer.shift();
    }
  }
}

function async<T>(
  size: number,
  iterable: AsyncIterable<T>,
): AsyncIterableIterator<T[]> {
  let _iterator: AsyncIterator<T[], unknown, ConcurrentArg>;
  return {
    async next(_concurrent?: Concurrent) {
      if (_iterator === undefined) {
        _iterator = isConcurrent(_concurrent)
          ? asyncSequential(size, concurrent(_concurrent.length, iterable))
          : asyncSequential(size, iterable);
      }
      return _iterator.next(_concurrent);
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

/**
 * Returns Iterable/AsyncIterable of sliding windows of the given size over
 * the iterable. Windows overlap: each one starts one element after the
 * previous one. When the iterable has fewer elements than `size`, nothing
 * is yielded.
 *
 * Unlike `chunk`, which splits into non-overlapping groups, `windowed`
 * yields every consecutive run of `size` elements.
 *
 * @example
 * ```ts
 * const iter = windowed(2, [1, 2, 3, 4]);
 * iter.next(); // {done: false, value: [1, 2]}
 * iter.next(); // {done: false, value: [2, 3]}
 * iter.next(); // {done: false, value: [3, 4]}
 * iter.next(); // {done: true, value: undefined}
 *
 * // with pipe
 * pipe(
 *   [1, 2, 3, 4, 5],
 *   windowed(3),
 *   toArray,
 * ); // [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
 * ```
 */
function windowed<T>(
  size: number,
  iterable: Iterable<T>,
): IterableIterator<T[]>;
function windowed<T>(
  size: number,
  iterable: AsyncIterable<T>,
): AsyncIterableIterator<T[]>;

function windowed<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  size: number,
): (iterable: T) => ReturnIterableIteratorType<T, IterableInfer<T>[]>;

function windowed<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  size: number,
  iterable?: T,
):
  | IterableIterator<IterableInfer<T>[]>
  | AsyncIterableIterator<IterableInfer<T>[]>
  | ((iterable: T) => ReturnIterableIteratorType<T, IterableInfer<T>[]>) {
  if (iterable === undefined) {
    return (iterable: T) =>
      windowed(size, iterable as any) as ReturnIterableIteratorType<
        T,
        IterableInfer<T>[]
      >;
  }

  if (isIterable<IterableInfer<T>>(iterable)) {
    return sync(size, iterable);
  }

  if (isAsyncIterable<IterableInfer<T>>(iterable)) {
    return async(size, iterable);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default windowed;
