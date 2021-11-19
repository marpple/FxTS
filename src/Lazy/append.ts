import { isAsyncIterable, isIterable } from "../_internal/utils";
import concurrent, { isConcurrent } from "./concurrent";
import Awaited from "../types/Awaited";
import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";

function* sync<A>(a: A, iterable: Iterable<A>) {
  yield* iterable;
  yield a;
}

function asyncSequential<A>(
  a: Promise<A>,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A> {
  const iterator = iterable[Symbol.asyncIterator]();
  let finished = false;
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next() {
      if (finished) {
        return { done: true, value: undefined };
      }
      const { value, done } = await iterator.next();
      if (finished) {
        return { done: true, value: undefined };
      }
      if (done) {
        finished = true;
        return { done: false, value: await a };
      } else {
        return { done, value };
      }
    },
  };
}

function async<A>(
  a: Promise<A>,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A> {
  let iterator: AsyncIterator<A> | null = null;
  return {
    [Symbol.asyncIterator]() {
      return this;
    },

    async next(_concurrent: any) {
      if (iterator === null) {
        iterator = isConcurrent(_concurrent)
          ? asyncSequential(a, concurrent(_concurrent.length, iterable))
          : asyncSequential(a, iterable);
      }
      return iterator.next(_concurrent);
    },
  };
}

/**
 * Returns Iterable/AsyncIterable containing the contents of the given iterable,
 * followed by the given element.
 *
 * @example
 * ```ts
 * const iter = append(4, [1,2,3]);
 * iter.next() // {done: false, value: 1}
 * iter.next() // {done: false, value: 2}
 * iter.next() // {done: false, value: 3}
 * iter.next() // {done: false, value: 4}
 * iter.next() // {done: true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  [1,2,3],
 *  append(4),
 *  toArray,
 * ); // [1,2,3,4]
 *
 * await pipe(
 *  Promise.resolve([1, 2, 3]),
 *  append(4),
 *  toArray,
 * ); // [1, 2, 3, 4]
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
 *  toAsync,
 *  append(4),
 *  toArray,
 * ); // [1, 2, 3, 4]
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-append-civf7 | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
function append<A, B extends Iterable<A> | AsyncIterable<Awaited<A>>>(
  a: A,
): (iterable: B) => ReturnIterableIteratorType<B, Awaited<A>>;

function append<A>(a: A, iterable: Iterable<A>): IterableIterator<A>;

function append<A>(
  a: A | Promise<A>,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A>;

function append<A, B extends Iterable<A> | AsyncIterable<A>>(
  a: A,
  iterable?: Iterable<A> | AsyncIterable<A>,
):
  | IterableIterator<A>
  | AsyncIterableIterator<A>
  | ((iterable: B) => ReturnIterableIteratorType<B, A>) {
  if (iterable === undefined) {
    return (iterable: B) =>
      append(a, iterable as any) as ReturnIterableIteratorType<B, A>;
  }

  if (isAsyncIterable(iterable)) {
    return async(a instanceof Promise ? a : Promise.resolve(a), iterable);
  }

  if (isIterable(iterable)) {
    return sync(a, iterable);
  }

  throw new TypeError("iterable must be type of Iterable or AsyncIterable");
}

export default append;
