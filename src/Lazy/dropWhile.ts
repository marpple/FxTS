import IterableInfer from "../types/IterableInfer";
import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import { AsyncFunctionException } from "../_internal/error";
import { isAsyncIterable, isIterable, isPromise } from "../_internal/utils";
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
      continue;
    }
    yield a;
    yield* iterableIterator;
  }
}

async function* asyncSequential<A, B>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A> {
  const iterator = iterable[Symbol.asyncIterator]();
  const iterableIterator = {
    [Symbol.asyncIterator]() {
      return iterator;
    },
  };

  for await (const a of iterableIterator) {
    if (await f(a)) {
      continue;
    }

    yield a;
    yield* iterableIterator;
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
 * Returns Iterable/AsyncIterable excluding elements dropped from the beginning. Elements are dropped until the value applied to `f` returns falsey.
 *
 * @example
 * ```ts
 * const iter = dropWhile((a) => a < 3, [1, 2, 3, 4, 5]);
 * iter.next(); // {done:false, value: 3}
 * iter.next(); // {done:false, value: 4}
 * iter.next(); // {done:false, value: 5}
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3, 4, 5],
 *  dropWhile((a) => a < 3),
 *  toArray,
 * ); // [3, 4, 5]
 *
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4, 5]),
 *  dropWhile((a) => a < 3),
 *  toArray,
 * ); // [3, 4, 5]
 *
 * // if you want to use asynchronous callback
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4, 5]),
 *  toAsync,
 *  dropWhile(async (a) => a < 3),
 *  toArray,
 * ); // [3, 4, 5]
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3), Promise.resolve(4), Promise.resolve(5)],
 *  toAsync,
 *  dropWhile((a) => a < 3),
 *  toArray,
 * ); // [3, 4, 5]
 *
 * ```
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
function dropWhile<A, B = unknown>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): IterableIterator<A>;

function dropWhile<A, B = unknown>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A>;

function dropWhile<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: IterableInfer<A>) => B,
): (iterable: A) => ReturnIterableIteratorType<A>;

function dropWhile<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: IterableInfer<A>) => B,
  iterable?: A,
):
  | IterableIterator<IterableInfer<A>>
  | AsyncIterableIterator<IterableInfer<A>>
  | ((iterable: A) => ReturnIterableIteratorType<A>) {
  if (iterable === undefined) {
    return (iterable: A) => {
      return dropWhile(f, iterable as any) as ReturnIterableIteratorType<A>;
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

export default dropWhile;
