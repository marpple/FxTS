import { AsyncFunctionException } from "../_internal/error";
import { isAsyncIterable, isIterable, isPromise } from "../_internal/utils";
import type IterableInfer from "../types/IterableInfer";
import type ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import concurrent, { isConcurrent } from "./concurrent";

function* sync<A, B>(f: (a: A) => B, iterable: Iterable<A>) {
  const iterator = iterable[Symbol.iterator]();
  const iterableIterator = {
    [Symbol.iterator]() {
      return iterator;
    },
  };

  for (const a of iterableIterator) {
    const res = f(a);
    if (isPromise(res)) {
      throw new AsyncFunctionException();
    }

    if (res) {
      yield* iterableIterator;
    }
  }
}

async function* asyncSequential<A, B>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
) {
  const iterator = iterable[Symbol.asyncIterator]();
  const iterableIterator = {
    [Symbol.asyncIterator]() {
      return iterator;
    },
  };

  for await (const a of iterableIterator) {
    if (await f(a)) {
      yield* iterableIterator;
    }
  }
}

function async<A, B>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A> {
  let iterator: AsyncIterator<A>;
  return {
    [Symbol.asyncIterator]() {
      return this;
    },

    async next(_concurrent: any) {
      if (iterator === undefined) {
        iterator = isConcurrent(_concurrent)
          ? asyncSequential(f, concurrent(_concurrent.length, iterable))
          : asyncSequential(f, iterable);
      }

      return iterator.next(_concurrent);
    },
  };
}

/**
 * Returns Iterable/AsyncIterable excluding elements dropped from the beginning.
 * Elements are deleted until the value applied to f returns truly. (It is deleted including the first value applied as true)
 *
 * @example
 * ```ts
 * const iter = dropUntil((a) => a > 3, [1, 2, 3, 4, 5, 1, 2]);
 * iter.next(); // {done:false, value: 5}
 * iter.next(); // {done:false, value: 1}
 * iter.next(); // {done:false, value: 2}
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3, 4, 5, 1, 2],
 *  dropUntil((a) => a > 3),
 *  toArray,
 * ); // [5, 1, 2]
 *
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4, 5, 1, 2]),
 *  dropUntil((a) => a > 3),
 *  toArray,
 * ); // [5, 1, 2]
 *
 * // if you want to use asynchronous callback
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4, 5, 1, 2]),
 *  toAsync,
 *  dropUntil(async (a) => a > 3),
 *  toArray,
 * ); // [5, 1, 2]
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3), Promise.resolve(4),
 * Promise.resolve(5), Promise.resolve(1), Promise.resolve(2)],
 *  toAsync,
 *  dropUntil((a) => a > 3),
 *  toArray,
 * ); // [5, 1, 2]
 * ```
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
function dropUntil<A, B = unknown>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): IterableIterator<A>;

function dropUntil<A, B = unknown>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A>;

function dropUntil<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: IterableInfer<A>) => B,
): (iterable: A) => ReturnIterableIteratorType<A>;

function dropUntil<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: IterableInfer<A>) => B,
  iterable?: A,
):
  | IterableIterator<IterableInfer<A>>
  | AsyncIterableIterator<IterableInfer<A>>
  | ((iterable: A) => ReturnIterableIteratorType<A>) {
  if (iterable === undefined) {
    return (iterable: A) => {
      return dropUntil(f, iterable as any) as ReturnIterableIteratorType<A>;
    };
  }

  if (isIterable<IterableInfer<A>>(iterable)) {
    return sync(f, iterable);
  }

  if (isAsyncIterable<IterableInfer<A>>(iterable)) {
    return async(f, iterable);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default dropUntil;
