import { isAsyncIterable, isIterable } from "../_internal/utils";
import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import IterableInfer from "../types/IterableInfer";
import toArray from "../toArray";
import isArray from "../isArray";
import isString from "../isString";
import concurrent, { isConcurrent } from "./concurrent";

function* stringTakeRight(length: number, str: string) {
  const arr = Array.from(str);
  const index = arr.length - length;
  for (let i = index; i < arr.length; i++) {
    if (arr[i]) yield arr[i];
  }
}

function* arrayTakeRight<A>(length: number, arr: Array<A>) {
  const index = arr.length - length;
  for (let i = index; i < arr.length; i++) {
    if (arr[i]) yield arr[i];
  }
}

function* sync<A>(length: number, iterable: Iterable<A>): IterableIterator<A> {
  const arr = toArray(iterable);
  const index = arr.length - length;
  for (let i = index; i < arr.length; i++) {
    if (arr[i]) yield arr[i];
  }
}

async function* asyncSequential<T>(length: number, iterable: AsyncIterable<T>) {
  const arr = await toArray(iterable);
  const index = arr.length - length;
  for (let i = index; i < arr.length; i++) {
    if (arr[i]) {
      yield arr[i];
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
 * Returns Iterable/AsyncIterable that taken the last argument `l` values from iterable
 *
 * @example
 * ```ts
 * const iter = takeRight(2, [0, 1, 2, 3, 4, 5, 6]);
 * iter.next() // {done:false, value: 5}
 * iter.next() // {done:false, value: 6}
 * iter.next() // {done:true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  [0, 1, 2, 3, 4, 5, 6],
 *  takeRight(2),
 *  toArray,
 * ); // [5, 6]
 *
 * await pipe(
 *  Promise.resolve([0, 1, 2, 3, 4, 5, 6]),
 *  takeRight(2),
 *  toArray,
 * ); // [5, 6]
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(0), Promise.resolve(1), Promise.resolve(2),
 *   Promise.resolve(3), Promise.resolve(4), Promise.resolve(5), Promise.resolve(6)],
 *  toAsync,
 *  takeRight(2),
 *  toArray,
 * ); // [5, 6]
 * ```
 *
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
// prettier-ignore
function takeRight<A>(
  l: number,
  iterable: Iterable<A>
): IterableIterator<A>;

function takeRight<A>(
  l: number,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A>;

function takeRight<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  l: number,
): (iterable: A) => ReturnIterableIteratorType<A>;

function takeRight<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  l: number,
  iterable?: A,
):
  | IterableIterator<IterableInfer<A>>
  | AsyncIterableIterator<IterableInfer<A>>
  | ((iterable: A) => ReturnIterableIteratorType<A>) {
  if (l < 0) {
    throw new RangeError("'length' must be greater than 0");
  }

  if (iterable === undefined) {
    return (iterable: A) => {
      return takeRight(l, iterable as any) as ReturnIterableIteratorType<A>;
    };
  }

  if (isArray(iterable)) {
    return arrayTakeRight<A>(l, iterable) as any;
  }

  if (isString(iterable)) {
    return stringTakeRight(l, iterable) as any;
  }

  if (isIterable<IterableInfer<A>>(iterable)) {
    return sync(l, iterable);
  }

  if (isAsyncIterable<IterableInfer<A>>(iterable)) {
    return async(l, iterable);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default takeRight;
