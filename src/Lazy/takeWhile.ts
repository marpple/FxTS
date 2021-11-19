import { isAsyncIterable, isIterable } from "../_internal/utils";
import IterableInfer from "../types/IterableInfer";
import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import { AsyncFunctionException } from "../_internal/error";

function* sync<A, B>(f: (a: A) => B, iterable: Iterable<A>) {
  for (const item of iterable) {
    const res = f(item);
    if (res instanceof Promise) {
      throw new AsyncFunctionException();
    }

    if (!res) {
      break;
    }
    yield item;
  }
}

function async<A, B>(
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
      const { done, value } = await iterator.next(_concurrent);

      if (done || end) {
        return { done: true, value: undefined };
      }

      if (!(await f(value))) {
        end = true;
        return { done: true, value: undefined };
      }

      return { done: false, value };
    },
  };
}

/**
 * Returns Iterable/AsyncIterable that taken values as long as each value satisfies the give `f`.
 *
 * @example
 * ```ts
 * const iter = takeWhile(a => a < 3, [1, 2, 3, 4, 5, 6]);
 * iter.next() // {done:false, value: 1}
 * iter.next() // {done:false, value: 2}
 * iter.next() // {done:true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3, 4, 5, 6],
 *  takeWhile(a => a < 3),
 *  toArray,
 * ); // [1, 2]
 *
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4, 5, 6]),
 *  takeWhile(a => a < 3),
 *  toArray,
 * ); // [1, 2]
 *
 * // if you want to use asynchronous callback
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4, 5, 6]),
 *  toAsync,
 *  takeWhile(async (a) => a < 3),
 *  toArray,
 * ); // [1, 2]
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3),
 * Promise.resolve(4), Promise.resolve(5), Promise.resolve(6)],
 *  toAsync,
 *  takeWhile(a => a < 3),
 *  toArray,
 * ); // [1, 2]
 *
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-takewhile-e6gqt | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
function takeWhile<A, B>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): IterableIterator<A>;

function takeWhile<A, B>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A>;

function takeWhile<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: IterableInfer<A>) => B,
): (iterable: A) => ReturnIterableIteratorType<A>;

function takeWhile<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: A) => B,
  iterable?: Iterable<A> | AsyncIterable<A>,
):
  | IterableIterator<IterableInfer<A>>
  | AsyncIterableIterator<IterableInfer<A>>
  | ((iterable: A) => ReturnIterableIteratorType<A>) {
  if (iterable === undefined) {
    return (iterable: A) => {
      return takeWhile(f, iterable as any) as ReturnIterableIteratorType<A>;
    };
  }

  if (isIterable(iterable)) {
    return sync(f, iterable) as IterableIterator<IterableInfer<A>>;
  }

  if (isAsyncIterable(iterable)) {
    return async(f, iterable) as AsyncIterableIterator<IterableInfer<A>>;
  }

  throw new TypeError("iterable must be type of Iterable or AsyncIterable");
}

export default takeWhile;
