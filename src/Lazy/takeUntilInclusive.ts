import { AsyncFunctionException } from "../_internal/error";
import { isAsyncIterable, isIterable, isPromise } from "../_internal/utils";
import type IterableInfer from "../types/IterableInfer";
import type ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import concurrent, { isConcurrent } from "./concurrent";

function* sync<A, B>(f: (a: A) => B, iterable: Iterable<A>) {
  for (const item of iterable) {
    yield item;

    const res = f(item);
    if (isPromise(res)) {
      throw new AsyncFunctionException();
    }

    if (res) {
      break;
    }
  }
}

function asyncSequential<A, B>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A> {
  const iterator = iterable[Symbol.asyncIterator]();
  let end = false;
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next(_concurrent) {
      if (end) {
        return { done: true, value: undefined };
      }

      const { done, value } = await iterator.next(_concurrent);
      if (done || end) {
        return { done: true, value: undefined };
      }

      const cond = await f(value);
      if (end) {
        return { done: true, value: undefined };
      }

      if (cond) {
        end = true;
      }

      return { done: false, value };
    },
  };
}

function async<A, B>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A> {
  let _iterator: AsyncIterator<A>;
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
 * Returns Iterable/AsyncIterable that taken values until truthy when given `f` is applied.
 *
 * @example
 * ```ts
 * const iter = takeUntilInclusive(a => a % 2 === 0, [1, 2, 3, 4, 5, 6]);
 * iter.next() // {done:false, value: 1}
 * iter.next() // {done:false, value: 2}
 * iter.next() // {done:true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3, 4, 5, 6],
 *  takeUntilInclusive(a => a % 2 === 0),
 *  toArray,
 * ); // [1, 2]
 *
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4, 5, 6]),
 *  takeUntilInclusive(a => a % 2 === 0),
 *  toArray,
 * ); // [1, 2]
 *
 * // if you want to use asynchronous callback
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4, 5, 6]),
 *  toAsync,
 *  takeUntilInclusive(async (a) => a % 2 === 0),
 *  toArray,
 * ); // [1, 2]
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3),
 * Promise.resolve(4), Promise.resolve(5), Promise.resolve(6)],
 *  toAsync,
 *  takeUntilInclusive(a => a % 2 === 0),
 *  toArray,
 * ); // [1, 2]
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-takeuntil-gv1jk | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
function takeUntilInclusive<A, B>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): IterableIterator<A>;

function takeUntilInclusive<A, B>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A>;

function takeUntilInclusive<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B,
>(
  f: (a: IterableInfer<A>) => B,
): (iterable: A) => ReturnIterableIteratorType<A>;

function takeUntilInclusive<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B,
>(
  f: (a: A) => B,
  iterable?: Iterable<A> | AsyncIterable<A>,
):
  | IterableIterator<IterableInfer<A>>
  | AsyncIterableIterator<IterableInfer<A>>
  | ((iterable: A) => ReturnIterableIteratorType<A>) {
  if (iterable === undefined) {
    return (iterable: A) => {
      return takeUntilInclusive(
        f,
        iterable as any,
      ) as ReturnIterableIteratorType<A>;
    };
  }

  if (isIterable(iterable)) {
    return sync(f, iterable) as IterableIterator<IterableInfer<A>>;
  }

  if (isAsyncIterable(iterable)) {
    return async(f, iterable) as AsyncIterableIterator<IterableInfer<A>>;
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default takeUntilInclusive;
