import { UniversalIterable, UniversalIterator } from "../types/Utils";
import { isAsyncIterable, isIterable } from "../_internal/utils";
import map from "./map";
import zip from "./zip";

/**
 * Returns Iterable/AsyncIterable out of the two supplied by applying `f` to each same positioned pair in Iterable/AsyncIterable.
 *
 * @example
 * ```ts
 * const iter = zipWith((a,b) => [a,b], [1,2,3], ['a','b','c']);
 * iter.next(); // {value: [1, 'a'] , done: false}
 * iter.next(); // {value: [2, 'b'] , done: false}
 * iter.next(); // {value: [3, 'c'] , done: false}
 * iter.next(); // {value: undefined , done: true}
 * ```
 */
function zipWith<A, B, C>(
  f: (a: A, b: B) => C,
  iterable1: Iterable<A>,
  iterable2: Iterable<B>,
): IterableIterator<C>;

function zipWith<A, B, C>(
  f: (a: A, b: B) => C,
  iterable1: Iterable<A>,
  iterable2: AsyncIterable<B>,
): AsyncIterableIterator<C>;

function zipWith<A, B, C>(
  f: (a: A, b: B) => C,
  iterable1: AsyncIterable<A>,
  iterable2: Iterable<B>,
): AsyncIterableIterator<C>;

function zipWith<A, B, C>(
  f: (a: A, b: B) => C,
  iterable1: AsyncIterable<A>,
  iterable2: AsyncIterable<B>,
): AsyncIterableIterator<C>;

function zipWith<A, B, C>(
  f: (a: A, b: B) => C,
  iterable1: UniversalIterable<A>,
  iterable2: UniversalIterable<B>,
): UniversalIterator<C> {
  if (isIterable(iterable1) && isIterable(iterable2)) {
    return map(([a, b]) => f(a, b), zip(iterable1, iterable2));
  }
  if (isIterable(iterable1) && isAsyncIterable(iterable2)) {
    return map(([a, b]) => f(a, b), zip(iterable1, iterable2));
  }
  if (isAsyncIterable(iterable1) && isIterable(iterable2)) {
    return map(([a, b]) => f(a, b), zip(iterable1, iterable2));
  }
  if (isAsyncIterable(iterable1) && isAsyncIterable(iterable2)) {
    return map(([a, b]) => f(a, b), zip(iterable1, iterable2));
  }

  throw new TypeError(
    "'iterable1' and 'iterable2' must be type of Iterable or AsyncIterable",
  );
}

export default zipWith;
