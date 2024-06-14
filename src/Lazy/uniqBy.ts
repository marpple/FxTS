import { isAsyncIterable, isIterable } from "../_internal/utils";
import pipe from "../pipe";
import pipe1 from "../pipe1";
import type IterableInfer from "../types/IterableInfer";
import type ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import filter from "./filter";

/**
 * Unlike {@link https://fxts.dev/docs/uniq | uniq} returns Iterable/AsyncIterable
 * with duplicate values removed by applying with `f` inside the given Iterable/AsyncIterable.
 * The order of result values is determined by the order they occur in the array.
 *
 * @example
 * ```ts
 * const iter = uniqBy(a => a.age, [{age: 21}, {age: 23}, {age: 21}, {age: 34}]);
 * iter.next() // {done:false, value: {age: 21}}
 * iter.next() // {done:false, value: {age: 23}}
 * iter.next() // {done:false, value: {age: 34}}
 * iter.next() // {done:true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  [{age: 21}, {age: 23}, {age: 21}, {age: 34}],
 *  uniqBy(a => a.age),
 *  toArray,
 * ); // [{age: 21}, {age: 23}, {age: 34}]
 *
 * await pipe(
 *  Promise.resolve([{age: 21}, {age: 23}, {age: 21}, {age: 34}]),
 *  uniqBy(a => a.age),
 *  toArray,
 * ); // [{age: 21}, {age: 23}, {age: 34}]
 *
 * // if you want to use asynchronous callback
 * await pipe(
 *  Promise.resolve([{age: 21}, {age: 23}, {age: 21}, {age: 34}]),
 *  toAsync,
 *  uniqBy(async (a) => a.age),
 *  toArray,
 * ); // [{age: 21}, {age: 23}, {age: 34}]
 *
 * // toAsync
 * await pipe(
 *  [Promise.resolve({age: 21}), Promise.resolve({age: 23}), Promise.resolve({age: 21}), Promise.resolve({age: 34})],
 *  toAsync,
 *  uniqBy(a => a.age),
 *  toArray,
 * ); // [{age: 21}, {age: 23}, {age: 34}]
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-uniqby-zb5d9 | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
function uniqBy<A, B>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): IterableIterator<A>;

function uniqBy<A, B>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A>;

function uniqBy<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: IterableInfer<A>) => B,
  iterable?: A,
): (iterable: A) => ReturnIterableIteratorType<A>;

function uniqBy<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: IterableInfer<A>) => B,
  iterable?: A,
):
  | IterableIterator<A>
  | AsyncIterableIterator<A>
  | ((iterable: A) => ReturnIterableIteratorType<A>) {
  if (iterable === undefined) {
    return (iterable) => {
      return uniqBy(f, iterable as any) as ReturnIterableIteratorType<A>;
    };
  }

  const s = new Set();
  const checkAndAdd = (b: B) => {
    if (s.has(b)) {
      return false;
    }

    s.add(b);
    return true;
  };

  if (isIterable(iterable)) {
    return pipe(
      iterable,
      filter((a) => pipe1(f(a), checkAndAdd)),
    ) as IterableIterator<A>;
  }

  if (isAsyncIterable(iterable)) {
    return pipe(
      iterable,
      filter((a) => pipe1(f(a), checkAndAdd)),
    ) as AsyncIterableIterator<A>;
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default uniqBy;
