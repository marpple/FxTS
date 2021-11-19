import IterableInfer from "../types/IterableInfer";
import ReturnConcatType from "../types/ReturnConcatType";
import { isAsyncIterable, isIterable } from "../_internal/utils";

function* sync<A>(a: Iterable<A>, b: Iterable<A>): IterableIterator<A> {
  yield* a;
  yield* b;
}

function async<A>(
  a: AsyncIterable<A>,
  b: AsyncIterable<A>,
): AsyncIterableIterator<A> {
  let leftDone = false;
  const leftIterator = a[Symbol.asyncIterator]();
  const rightIterator = b[Symbol.asyncIterator]();
  return {
    [Symbol.asyncIterator]() {
      return this;
    },

    async next(_concurrent: any) {
      const iterator = leftDone ? rightIterator : leftIterator;
      const { done, value } = await iterator.next(_concurrent);
      if (done) {
        if (iterator === leftIterator) {
          leftDone = true;
        }
        return rightIterator.next(_concurrent);
      } else {
        return { done, value };
      }
    },
  };
}

function toAsyncIterable<T>(
  iterable: Iterable<T> | AsyncIterable<T>,
): AsyncIterable<T> {
  if (isAsyncIterable(iterable)) {
    return iterable;
  }

  const iterator = iterable[Symbol.iterator]() as unknown as AsyncIterator<T>;
  return {
    [Symbol.asyncIterator]() {
      return iterator;
    },
  };
}

/**
 * Returns the result of concatenating the given iterable.
 *
 * @example
 * ```ts
 * const iter = concat([1, 2], [3, 4]);
 * iter.next() // {done:false, value: 1}
 * iter.next() // {done:false, value: 2}
 * iter.next() // {done:false, value: 3}
 * iter.next() // {done:false, value: 4}
 * iter.next() // {done:true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  [3, 4],
 *  concat([1, 2]),
 *  toArray,
 * ); // [1, 2, 3, 4]
 *
 * await pipe(
 *  Promise.resolve([3, 4]),
 *  concat([1, 2]),
 *  toArray,
 * ); // [1, 2, 3, 4]
 *
 *  await pipe(
 *  [Promise.resolve(3), Promise.resolve(4)],
 *  toAsync,
 *  concat([1, 2]),
 *  toArray,
 * ); // [1, 2, 3, 4]
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-concat-mhd7d | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
// prettier-ignore
function concat<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B extends Iterable<unknown> | AsyncIterable<unknown>
>(a: A, b: B): ReturnConcatType<A, B>;

function concat<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B extends Iterable<unknown> | AsyncIterable<unknown>,
>(a: A): (b: B) => ReturnConcatType<A, B>;

function concat<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B extends Iterable<unknown> | AsyncIterable<unknown>,
>(
  a: A,
  b?: B,
):
  | IterableIterator<IterableInfer<A> | IterableInfer<B>>
  | AsyncIterableIterator<IterableInfer<A> | IterableInfer<B>>
  | ((b: B) => ReturnConcatType<A, B>) {
  if (b === undefined) {
    return (b: B): ReturnConcatType<A, B> => {
      return concat(a, b) as ReturnConcatType<A, B>;
    };
  }

  if (isAsyncIterable(a) || isAsyncIterable(b)) {
    // prettier-ignore
    return async(toAsyncIterable(a), toAsyncIterable(b)) as ReturnConcatType<A, B>;
  }

  if (isIterable(a) && isIterable(b)) {
    return sync(a, b) as ReturnConcatType<A, B>;
  }

  throw new TypeError("a,b must be type of Iterable or AsyncIterable");
}

export default concat;
