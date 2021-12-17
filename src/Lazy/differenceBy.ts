import map from "./map";
import reject from "./reject";
import pipe1 from "../pipe1";
import toAsync from "./toAsync";
import toArray from "../toArray";
import concurrent, { isConcurrent } from "./concurrent";
import { isAsyncIterable, isIterable } from "../_internal/utils";

const hasValue = (set: Set<unknown>, a: unknown) => {
  return pipe1(a, (b) => set.has(b));
};

function sync<T>(
  f: (a: T) => unknown,
  iterable1: Iterable<T>,
  iterable2: Iterable<T>,
) {
  const set = new Set(map(f, iterable1));
  return reject((a) => hasValue(set, f(a)), iterable2);
}

async function* asyncSequential<T>(
  f: (a: T) => unknown,
  iterable1: AsyncIterable<T>,
  iterable2: AsyncIterable<T>,
) {
  const set = new Set(await toArray(map(f, iterable1)));
  yield* reject((a) => hasValue(set, f(a)), iterable2);
}

function async<T>(
  f: (a: T) => unknown,
  iterable1: AsyncIterable<T>,
  iterable2: AsyncIterable<T>,
): AsyncIterableIterator<T> {
  let _iterator: AsyncIterator<T>;
  return {
    async next(_concurrent: any) {
      if (_iterator === undefined) {
        _iterator = isConcurrent(_concurrent)
          ? asyncSequential(
              f,
              iterable1,
              concurrent(_concurrent.length, iterable2),
            )
          : asyncSequential(f, iterable1, iterable2);
      }

      return _iterator.next(_concurrent);
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

/**
 * Returns Iterable/AsyncIterable(i.e no duplicate) of all elements in the `iterable2` not contained in the `iterable1`.
 * Duplication is determined according to the value returned by applying the supplied `f` to `iterable2`.
 *
 * @example
 * ```ts
 * const iter = differenceBy(a => a.x, [{ x: 1 }, { x: 4 }], [{ x: 1 },  { x: 2 },  { x: 3 }])
 * iter.next(); // {value: {x: 2}, done: false}
 * iter.next(); // {value: {x: 3}, done: false}
 * iter.next(); // {value: undefined, done: true}
 * ```
 */
function differenceBy<A, B = unknown>(
  f: (a: A) => B,
  iterable1: Iterable<A>,
  iterable2: Iterable<A>,
): IterableIterator<A>;

function differenceBy<A, B = unknown>(
  f: (a: A) => B,
  iterable1: AsyncIterable<A>,
  iterable2: Iterable<A>,
): AsyncIterableIterator<A>;

function differenceBy<A, B = unknown>(
  f: (a: A) => B,
  iterable1: Iterable<A>,
  iterable2: AsyncIterable<A>,
): AsyncIterableIterator<A>;

function differenceBy<A, B = unknown>(
  f: (a: A) => B,
  iterable1: AsyncIterable<A>,
  iterable2: AsyncIterable<A>,
): AsyncIterableIterator<A>;

function differenceBy<A, B = unknown>(
  f: (a: A) => B,
  iterable1: Iterable<A> | AsyncIterable<A>,
  iterable2: Iterable<A> | AsyncIterable<A>,
): IterableIterator<A> | AsyncIterableIterator<A> {
  if (isIterable(iterable1) && isIterable(iterable2)) {
    return sync(f, iterable1, iterable2);
  }
  if (isIterable(iterable1) && isAsyncIterable(iterable2)) {
    return async(f, toAsync(iterable1), iterable2);
  }
  if (isAsyncIterable(iterable1) && isIterable(iterable2)) {
    return async(f, iterable1, toAsync(iterable2));
  }
  if (isAsyncIterable(iterable1) && isAsyncIterable(iterable2)) {
    return async(f, iterable1, iterable2);
  }

  throw new TypeError(
    "'iterable1' and 'iterable2' must be type of Iterable or AsyncIterable",
  );
}

export default differenceBy;
