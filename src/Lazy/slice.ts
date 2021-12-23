import isNumber from "../isNumber";
import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import { isAsyncIterable, isIterable } from "../_internal/utils";

function* sync<T>(
  start = 0,
  end = Infinity,
  iterable: Iterable<T>,
): IterableIterator<T> {
  let i = 0;
  for (const item of iterable) {
    if (i >= start && i < end) {
      yield item;
    }
    i += 1;
  }
}

async function* async<T>(
  start = 0,
  end = Infinity,
  iterable: AsyncIterable<T>,
): AsyncIterableIterator<T> {
  let i = 0;
  for await (const item of iterable) {
    if (i >= start && i < end) {
      yield item;
    }
    i += 1;
  }
}

function _slice<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  start: number,
  end: number,
  iterable: T,
) {
  if (!isNumber(start) || !isNumber(end)) {
    throw new TypeError("'start' and 'end' must be type of number");
  }

  if (isIterable(iterable)) {
    return sync(start, end, iterable);
  }

  if (isAsyncIterable(iterable)) {
    return async(start, end, iterable);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

/**
 * Returns Iterable/AsyncIterable of the given elements from startIndex(inclusive) to endIndex(exclusive).
 *
 * @example
 * ```ts
 * const iter1 = slice(1, 3, ['a', 'b', 'c', 'd', 'e']);
 * iter1.next(); // {value: 'b', done: false};
 * iter1.next(); // {value: 'c', done: false};
 * iter1.next(); // {value: undefined, done: true};
 *
 * const iter2 = slice(3, ['a', 'b', 'c', 'd', 'e']);
 * iter2.next(); // {value: 'd', done: false};
 * iter2.next(); // {value: 'e', done: false};
 * iter2.next(); // {value: undefined, done: true};
 *
 * const iter3 = slice(3, "abcde");
 * iter3.next(); // {value: 'd', done: false};
 * iter3.next(); // {value: 'e', done: false};
 * iter3.next(); // {value: undefined, done: true};
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3, 4, 5],
 *  slice(3),
 *  toArray,
 * ); // [4, 5]
 *
 * pipe(
 *  [1, 2, 3, 4, 5],
 *  slice(1, 3),
 *  toArray,
 * ); // [2, 3]
 * ```
 */
// prettier-ignore
function slice<T>(
  start: number, 
  iterable: Iterable<T>
): IterableIterator<T>;

function slice<T>(
  start: number,
  iterable: AsyncIterable<T>,
): AsyncIterableIterator<T>;

function slice<T>(
  start: number,
  end: number,
  iterable: Iterable<T>,
): IterableIterator<T>;

function slice<T>(
  start: number,
  end: number,
  iterable: AsyncIterable<T>,
): AsyncIterableIterator<T>;

function slice<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  start: number,
): (iterable: A) => ReturnIterableIteratorType<A>;

function slice<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  start: number,
  end: number,
): (iterable: A) => ReturnIterableIteratorType<A>;

function slice<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  start: number | T,
  end?: number | T,
  iterable?: T,
) {
  if (iterable === undefined) {
    if (end === undefined) {
      return (iterable: T) => {
        return _slice(start as number, Infinity, iterable);
      };
    }

    if (isIterable(end) || isAsyncIterable(end)) {
      return _slice(start as number, Infinity, end);
    }

    if (isNumber(end)) {
      return (iterable: T) => {
        return _slice(start as number, end, iterable);
      };
    }

    return (iterable: T) => {
      return _slice(0, Infinity, iterable);
    };
  }

  return _slice(start as number, end as number, iterable as T);
}

export default slice;
