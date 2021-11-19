import Awaited from "../types/Awaited";
import ReturnPrependType from "../types/ReturnPrependType";
import { isAsyncIterable, isIterable } from "../_internal/utils";

function* sync<A>(a: A, iterable: Iterable<A>): IterableIterator<A> {
  yield a;
  yield* iterable;
}

function async<A>(
  a: Promise<A>,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A> {
  let isFirstItem = true;
  const iterator = iterable[Symbol.asyncIterator]();
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next(concurrent) {
      if (isFirstItem) {
        isFirstItem = false;
        return { done: false, value: await a };
      }
      return iterator.next(concurrent);
    },
  };
}

/**
 * Returns Iterable/AsyncIterable with the given element at the front,
 * followed by the contents of iterable.
 *
 * @example
 * ```ts
 * const iter = prepend(4, [1, 2, 3]);
 * iter.next() // {done:false, value: 4}
 * iter.next() // {done:false, value: 1}
 * iter.next() // {done:false, value: 2}
 * iter.next() // {done:false, value: 3}
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3],
 *  prepend(4),
 *  toArray,
 * ); // [4, 1, 2, 3]
 *
 * await pipe(
 *  Promise.resolve([1, 2, 3]),
 *  prepend(4),
 *  toArray,
 * ); // [4, 1, 2, 3]
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
 *  toAsync,
 *  prepend(4),
 *  toArray,
 * ); // [4, 1, 2, 3]
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-prepend-70ymx | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
function prepend<A>(a: A, iterable: Iterable<A>): IterableIterator<A>;

function prepend<A, B extends Iterable<A> | AsyncIterable<Awaited<A>>>(
  a: A,
): (iterable: B) => ReturnPrependType<A, B>;

function prepend<A>(
  a: A | Promise<A>,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A>;

function prepend<A, B extends Iterable<A> | AsyncIterable<Awaited<A>>>(
  a: A,
  iterable?: Iterable<A> | AsyncIterable<A>,
):
  | IterableIterator<A>
  | AsyncIterableIterator<A>
  | ((iterable: B) => ReturnPrependType<A, B>) {
  if (iterable === undefined) {
    return (iterable: B) =>
      prepend(a, iterable as any) as ReturnPrependType<A, B>;
  }

  if (isAsyncIterable(iterable)) {
    return async(a instanceof Promise ? a : Promise.resolve(a), iterable);
  }

  if (isIterable(iterable)) {
    return sync(a, iterable);
  }

  throw new TypeError("iterable must be type of Iterable or AsyncIterable");
}

export default prepend;
