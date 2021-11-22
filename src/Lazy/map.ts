import { isAsyncIterable, isIterable } from "../_internal/utils";
import Awaited from "../types/Awaited";
import IterableInfer from "../types/IterableInfer";
import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import { AsyncFunctionException } from "../_internal/error";
import concurrent, { isConcurrent } from "./concurrent";

function sync<A, B>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): IterableIterator<B> {
  const iterator = iterable[Symbol.iterator]();

  return {
    next() {
      const { done, value } = iterator.next();
      if (done) {
        return {
          done: true,
          value: undefined,
        };
      }

      const res = f(value);
      if (res instanceof Promise) {
        throw new AsyncFunctionException();
      }

      return {
        done: false,
        value: res,
      };
    },
    [Symbol.iterator]() {
      return this;
    },
  };
}

function asyncSequential<A, B>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<B> {
  const iterator = iterable[Symbol.asyncIterator]();

  return {
    async next(_concurrent) {
      const { done, value } = await iterator.next(_concurrent);
      if (done) return { done, value } as IteratorReturnResult<void>;
      return {
        done: false,
        value: await f(value),
      };
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

function async<A, B>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<B> {
  let _iterator: AsyncIterator<B>;
  return {
    async next(_concurrent: any) {
      if (_iterator === undefined) {
        _iterator = isConcurrent(_concurrent)
          ? asyncSequential(f, concurrent(_concurrent.length, iterable))
          : asyncSequential(f, iterable);
      }
      return _iterator.next(_concurrent);
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

/**
 * Returns Iterable/AsyncIterable of values by running each applying `f`.
 *
 * @example
 * ```ts
 * const iter = map(a => a + 10, [1, 2, 3, 4]);
 * iter.next() // {done:false, value: 11}
 * iter.next() // {done:false, value: 12}
 * iter.next() // {done:false, value: 13}
 * iter.next() // {done:false, value: 14},
 * iter.next() // {done:true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3, 4],
 *  map(a => a + 10),
 *  toArray,
 * ); // [11, 12, 13, 14]
 *
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4]),
 *  map(a => a + 10),
 *  toArray,
 * ); // [11, 12, 13, 14]
 *
 * // if you want to use asynchronous callback
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4]),
 *  toAsync,
 *  map(async (a) => a + 10),
 *  toArray,
 * ); // [11, 12, 13, 14]
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3), Promise.resolve(4)],
 *  toAsync,
 *  map(a => a + 10),
 *  toArray,
 * ); // [11, 12, 13, 14]
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-map-j68jv | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
// prettier-ignore
function map<A, B>(
  f: (a: A) => B,
  iterable: Iterable<A>
): IterableIterator<B>;

function map<A, B>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<Awaited<B>>;

function map<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: IterableInfer<A>) => B,
): (iterable: A) => ReturnIterableIteratorType<A, B>;

function map<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: IterableInfer<A>) => B,
  iterable?: A,
):
  | IterableIterator<B>
  | AsyncIterableIterator<B>
  | ((iterable: A) => ReturnIterableIteratorType<A, B>) {
  if (iterable === undefined) {
    return (iterable: A): ReturnIterableIteratorType<A, B> => {
      return map(f, iterable as any) as ReturnIterableIteratorType<A, B>;
    };
  }

  if (isIterable(iterable)) {
    return sync(f, iterable as Iterable<IterableInfer<A>>);
  }

  if (isAsyncIterable(iterable)) {
    return async(f, iterable as AsyncIterable<IterableInfer<A>>);
  }

  throw new TypeError("iterable must be type of Iterable or AsyncIterable");
}

export default map;
