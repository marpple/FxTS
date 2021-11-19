import take from "./take";
import toArray from "../toArray";
import {
  asyncEmpty,
  empty,
  isAsyncIterable,
  isIterable,
} from "../_internal/utils";
import IterableInfer from "../types/IterableInfer";
import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import concurrent, { isConcurrent } from "./concurrent";

function* sync<T>(size: number, iterable: Iterable<T>): IterableIterator<T[]> {
  const iterator = iterable[Symbol.iterator]();
  while (true) {
    const c = toArray(
      take(size, {
        [Symbol.iterator]() {
          return iterator;
        },
      }),
    );
    if (c.length > 0) yield c;
    if (c.length < size) return;
  }
}

async function* asyncSequential<T>(
  size: number,
  iterable: AsyncIterable<T>,
): AsyncIterableIterator<T[]> {
  let i = 0;
  let items: T[] = [];
  for await (const item of iterable) {
    if (i++ < size) {
      items.push(item);
    }
    if (i === size) {
      yield items;
      i = 0;
      items = [];
    }
  }
  if (items.length) {
    yield items;
  }
}

function async<T>(
  size: number,
  iterable: AsyncIterable<T>,
): AsyncIterableIterator<T[]> {
  let _iterator: AsyncIterator<T[]>;
  return {
    async next(_concurrent: any) {
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
 * Returns Iterable/AsyncIterable of elements split into groups the length of size.
 * If iterableIterator can't be split evenly, the final chunk will be the remaining elements.
 *
 * @example
 * ```ts
 * const iter = chunk(2, [1, 2, 3, 4]);
 * iter.next() // {done:false, value:[1, 2]}
 * iter.next() // {done:false, value:[3, 4]}
 * iter.next() // {done:true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3, 4],
 *  chunk(2),
 *  toArray,
 * ); // [[1, 2],[3, 4]]
 *
 * await pipe(
 *  Promise.resolve([1, 2, 3 ,4]),
 *  chunk(2),
 *  toArray,
 * ); // [[1, 2],[3, 4]]
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3), Promise.resolve(4)],
 *  toAsync,
 *  chunk(2),
 *  toArray,
 * ); // [[1, 2],[3, 4]]
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-chunk-gksly | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
function chunk<T>(size: number, iterable: Iterable<T>): IterableIterator<T[]>;
function chunk<T>(
  size: number,
  iterable: AsyncIterable<T>,
): AsyncIterableIterator<T[]>;

function chunk<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  size: number,
): (iterable: T) => ReturnIterableIteratorType<T, IterableInfer<T>[]>;

function chunk<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  size: number,
  iterable?: T,
):
  | IterableIterator<IterableInfer<T>[]>
  | AsyncIterableIterator<IterableInfer<T>[]>
  | ((iterable: T) => ReturnIterableIteratorType<T, IterableInfer<T>[]>) {
  if (iterable === undefined) {
    return (iterable: T) =>
      chunk(size, iterable as any) as ReturnIterableIteratorType<
        T,
        IterableInfer<T>[]
      >;
  }

  if (isIterable(iterable)) {
    if (size < 1) {
      return empty();
    } else {
      return sync(size, iterable) as IterableIterator<IterableInfer<T>[]>;
    }
  }

  if (isAsyncIterable(iterable)) {
    if (size < 1) {
      return asyncEmpty();
    } else {
      return async(size, iterable) as AsyncIterableIterator<IterableInfer<T>[]>;
    }
  }

  throw new TypeError("iterable must be type of Iterable or AsyncIterable");
}

export default chunk;
