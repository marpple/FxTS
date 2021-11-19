import { isAsyncIterable, isIterable } from "../_internal/utils";
import IterableInfer from "../types/IterableInfer";
import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import { AsyncFunctionException } from "../_internal/error";

function* sync<A, B>(f: (a: A) => B, iterable: Iterable<A>) {
  for (const item of iterable) {
    yield item;

    const res = f(item);
    if (res instanceof Promise) {
      throw new AsyncFunctionException();
    }

    if (res) {
      break;
    }
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

/**
 * Returns Iterable/AsyncIterable that taken values until truthy when given `f` is applied.
 *
 * @example
 * ```ts
 * const iter = takeUntil(a => a % 2 === 0, [1, 2, 3, 4, 5, 6]);
 * iter.next() // {done:false, value: 1}
 * iter.next() // {done:false, value: 2}
 * iter.next() // {done:true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3, 4, 5, 6],
 *  takeUntil(a => a % 2 === 0),
 *  toArray,
 * ); // [1, 2]
 *
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4, 5, 6]),
 *  takeUntil(a => a % 2 === 0),
 *  toArray,
 * ); // [1, 2]
 *
 * // if you want to use asynchronous callback
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4, 5, 6]),
 *  toAsync,
 *  takeUntil(async (a) => a % 2 === 0),
 *  toArray,
 * ); // [1, 2]
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3),
 * Promise.resolve(4), Promise.resolve(5), Promise.resolve(6)],
 *  toAsync,
 *  takeUntil(a => a % 2 === 0),
 *  toArray,
 * ); // [1, 2]
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-takeuntil-gv1jk | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
function takeUntil<A, B>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): IterableIterator<A>;

function takeUntil<A, B>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A>;

function takeUntil<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: IterableInfer<A>) => B,
): (iterable: A) => ReturnIterableIteratorType<A>;

function takeUntil<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: A) => B,
  iterable?: Iterable<A> | AsyncIterable<A>,
):
  | IterableIterator<IterableInfer<A>>
  | AsyncIterableIterator<IterableInfer<A>>
  | ((iterable: A) => ReturnIterableIteratorType<A>) {
  if (iterable === undefined) {
    return (iterable: A) => {
      return takeUntil(f, iterable as any) as ReturnIterableIteratorType<A>;
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

export default takeUntil;
