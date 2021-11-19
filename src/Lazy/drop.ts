import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import { isAsyncIterable, isIterable } from "../_internal/utils";
import concurrent, { isConcurrent } from "./concurrent";

function* sync<A>(length: number, iterable: Iterable<A>): IterableIterator<A> {
  const iterator = iterable[Symbol.iterator]();
  const iterableIterator = {
    [Symbol.iterator]() {
      return iterator;
    },
  };
  let i = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _ of iterableIterator) {
    if (++i === length) {
      yield* iterableIterator;
    }
  }
}

async function* asyncSequential<A>(length: number, iterable: AsyncIterable<A>) {
  const iterator = iterable[Symbol.asyncIterator]();
  const iterableIterator = {
    [Symbol.asyncIterator]() {
      return iterator;
    },
  };
  let i = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for await (const _ of iterableIterator) {
    if (++i === length) {
      yield* iterableIterator;
    }
  }
}

function async<A>(
  length: number,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A> {
  let iterator: AsyncIterator<A>;
  return {
    [Symbol.asyncIterator]() {
      return this;
    },

    next(_concurrent: any) {
      if (iterator === undefined) {
        iterator = isConcurrent(_concurrent)
          ? asyncSequential(length, concurrent(_concurrent.length, iterable))
          : asyncSequential(length, iterable);
      }

      return iterator.next(_concurrent);
    },
  };
}

/**
 * Returns all but the first `length` elements of the given iterable.
 *
 * @example
 * ```ts
 * const iter = drop(2, [1, 2, 3, 4]);
 * iter.next() // {done:false, value: 3}
 * iter.next() // {done:false, value: 4}
 * iter.next() // {done:true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3, 4],
 *  drop(2),
 *  toArray,
 * ); // [3, 4]
 *
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4]),
 *  drop(2),
 *  toArray,
 * ); // [3, 4]
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3), Promise.resolve(4)],
 *  toAsync,
 *  drop(2),
 *  toArray,
 * ); // [3, 4]
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-drop-2t0h0 | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
// prettier-ignore
function drop<A>(
  length: number,
  iterable: Iterable<A>
): IterableIterator<A>;

function drop<A>(
  length: number,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A>;

function drop<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  length: number,
): (iterable: A) => ReturnIterableIteratorType<A>;

function drop<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  length: number,
  iterable?: A,
):
  | IterableIterator<A>
  | AsyncIterableIterator<A>
  | ((iterable: A) => ReturnIterableIteratorType<A>) {
  if (iterable === undefined) {
    return (iterable: A): ReturnIterableIteratorType<A> => {
      return drop(length, iterable as any) as ReturnIterableIteratorType<A>;
    };
  }

  if (length < 1) {
    throw new TypeError("length must be greater than 1");
  }

  if (isIterable(iterable)) {
    return sync(length, iterable) as IterableIterator<A>;
  }

  if (isAsyncIterable(iterable)) {
    return async(length, iterable) as AsyncIterableIterator<A>;
  }

  throw new TypeError("iterable must be type of Iterable or AsyncIterable");
}

export default drop;
