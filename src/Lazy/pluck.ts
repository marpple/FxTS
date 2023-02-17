import { isAsyncIterable, isIterable } from "../_internal/utils";
import map from "./map";

/**
 * Returns Iterable/AsyncIterable by plucking the same named property off all objects in Iterable/AsyncIterable supplied.
 *
 * @example
 * ```ts
 * const iter = pluck('age', [{age:21}, {age:22}, {age:23}]);
 * iter.next(); // {done:false, value: 21}
 * iter.next(); // {done:false, value: 22}
 * iter.next(); // {done:false, value: 23}
 *
 * // with pipe
 * pipe(
 *  [{age:21}, {age:22}, {age:23}],
 *  pluck('age'),
 *  toArray,
 * ); // [21, 22 ,23]
 *
 * // if you want to use asynchronous callback
 * await pipe(
 *  Promise.resolve([{age:21}, {age:22}, {age:23}]),
 *  toAsync,
 *  pluck('age'),
 *  toArray,
 * ); // [21, 22 ,23]
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve({age:21}), Promise.resolve({age:22}), Promise.resolve({age:23})],
 *  toAsync,
 *  pluck('age'),
 *  toArray,
 * ); // [21, 22 ,23]
 * ```
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
function pluck<O extends object, K extends keyof O>(
  key: K,
  iterable: Iterable<O>,
): IterableIterator<O[K]>;

function pluck<O extends object, K extends keyof O>(
  key: K,
  iterable: AsyncIterable<O>,
): AsyncIterableIterator<O[K]>;

function pluck<O extends object, K extends keyof O>(
  key: K,
): (iterable: Iterable<O>) => IterableIterator<O[K]>;

function pluck<O extends object, K extends keyof O>(
  key: K,
): (iterable: AsyncIterable<O>) => AsyncIterableIterator<O[K]>;

function pluck<O extends object, K extends keyof O>(
  key: K,
  iterable?: Iterable<O> | AsyncIterable<O>,
):
  | IterableIterator<O[K]>
  | AsyncIterableIterator<O[K]>
  | ((iterable: Iterable<O>) => IterableIterator<O[K]>)
  | ((iterable: AsyncIterable<O>) => AsyncIterableIterator<O[K]>) {
  if (iterable === undefined) {
    return (iterable: any): any => {
      return pluck(key, iterable) as
        | IterableIterator<O[K]>
        | AsyncIterableIterator<O[K]>;
    };
  }

  if (isIterable(iterable)) {
    return map((a) => a[key], iterable);
  }

  if (isAsyncIterable(iterable)) {
    return map((a) => a[key], iterable);
  }

  throw new TypeError("iterable must be type of Iterable or AsyncIterable");
}

export default pluck;
