import isArray from "../isArray";
import isString from "../isString";
import toArray from "../toArray";
import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import { isAsyncIterable, isIterable } from "../_internal/utils";
import concurrent, { isConcurrent } from "./concurrent";

function* stringDropRight(length: number, str: string) {
  const arr = Array.from(str);
  for (let i = 0; i < str.length - length; i++) {
    yield arr[i];
  }
}

function* arrayDropRight<T>(length: number, arr: Array<T>) {
  for (let i = 0; i < arr.length - length; i++) {
    yield arr[i];
  }
}

function* sync<T>(length: number, iterable: Iterable<T>) {
  const arr = toArray(iterable);
  for (let i = 0; i < arr.length - length; i++) {
    yield arr[i];
  }
}

async function* asyncSequential<T>(length: number, iterable: AsyncIterable<T>) {
  const arr = await toArray(iterable);
  for (let i = 0; i < arr.length - length; i++) {
    yield arr[i];
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
 * Returns all but the last `length` elements of the given iterable.
 *
 * @example
 * ```ts
 * const iter = dropRight(2, [1, 2, 3, 4]);
 * iter.next() // {done:false, value: 1}
 * iter.next() // {done:false, value: 2}
 * iter.next() // {done:true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3, 4],
 *  dropRight(2),
 *  toArray,
 * ); // [1, 2]
 *
 * pipe(
 *  "abcde",
 *  dropRight(2),
 *  toArray,
 * ); // ["a", "b", "c"]
 *
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4]),
 *  dropRight(2),
 *  toArray,
 * ); // [1, 2]
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3), Promise.resolve(4)],
 *  toAsync,
 *  dropRight(2),
 *  toArray,
 * ); // [1, 2]
 * ```
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
// prettier-ignore
function dropRight<A>(
  length: number,
  iterable: Iterable<A>
): IterableIterator<A>;

function dropRight<A>(
  length: number,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A>;

function dropRight<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  length: number,
): (iterable: A) => ReturnIterableIteratorType<A>;

function dropRight<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  length: number,
  iterable?: A,
):
  | IterableIterator<A>
  | AsyncIterableIterator<A>
  | ((iterable: A) => ReturnIterableIteratorType<A>) {
  if (iterable === undefined) {
    return (iterable: A): ReturnIterableIteratorType<A> => {
      return dropRight(
        length,
        iterable as any,
      ) as ReturnIterableIteratorType<A>;
    };
  }

  if (length < 0) {
    throw new RangeError("'length' must be greater than 0");
  }

  if (isArray(iterable)) {
    return arrayDropRight<A>(length, iterable);
  }

  if (isString(iterable)) {
    return stringDropRight(length, iterable) as any;
  }

  if (isIterable<A>(iterable)) {
    return sync(length, iterable);
  }

  if (isAsyncIterable<A>(iterable)) {
    return async(length, iterable);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default dropRight;
