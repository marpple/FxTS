import { isAsyncIterable, isIterable } from "../_internal/utils";
import type ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import type IterableInfer from "../types/IterableInfer";

function* sync<A>(length: number, iterable: Iterable<A>): IterableIterator<A> {
  const iterator = iterable[Symbol.iterator]();
  let cur = null;
  while (length-- > 0 && (cur = iterator.next()).done === false) {
    yield cur.value;
  }
}

function async<A>(
  length: number,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A> {
  const iterator = iterable[Symbol.asyncIterator]();
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next(_concurrent) {
      if (length-- < 1) return { done: true, value: undefined };
      return iterator.next(_concurrent);
    },
  };
}

/**
 * Returns Iterable/AsyncIterable that taken the first argument `l` values from iterable
 *
 * @example
 * ```ts
 * const iter = take(2, [0, 1, 2, 3, 4, 5, 6]);
 * iter.next() // {done:false, value: 0}
 * iter.next() // {done:false, value: 1}
 * iter.next() // {done:true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  [0, 1, 2, 3, 4, 5, 6],
 *  take(2),
 *  toArray,
 * ); // [0, 1]
 *
 * await pipe(
 *  Promise.resolve([0, 1, 2, 3, 4, 5, 6]),
 *  take(2),
 *  toArray,
 * ); // [0, 1]
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(0), Promise.resolve(1), Promise.resolve(2),
 *   Promise.resolve(3), Promise.resolve(4), Promise.resolve(5), Promise.resolve(6)],
 *  toAsync,
 *  take(2),
 *  toArray,
 * ); // [0, 1]
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-take-372bs | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
// prettier-ignore
function take<A>(
  l: number,
  iterable: Iterable<A>
): IterableIterator<A>;

function take<A>(
  l: number,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A>;

function take<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  l: number,
): (iterable: A) => ReturnIterableIteratorType<A>;

function take<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  l: number,
  iterable?: A,
):
  | IterableIterator<IterableInfer<A>>
  | AsyncIterableIterator<IterableInfer<A>>
  | ((iterable: A) => ReturnIterableIteratorType<A>) {
  if (iterable === undefined) {
    return (iterable: A) => {
      return take(l, iterable as any) as ReturnIterableIteratorType<A>;
    };
  }

  if (isIterable<IterableInfer<A>>(iterable)) {
    return sync(l, iterable);
  }

  if (isAsyncIterable<IterableInfer<A>>(iterable)) {
    return async(l, iterable);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default take;
