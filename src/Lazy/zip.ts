import map from "./map";
import pipe from "../pipe";
import toArray from "../toArray";
import toAsync from "./toAsync";
import { isAsyncIterable, isIterable, toIterator } from "../_internal/utils";
import ReturnZipType from "../types/ReturnZipType";
import range from "./range";
import takeWhile from "./takeWhile";
import every from "../every";
import { UniversalIterable } from "../types/Utils";

function sync(
  iterable: Iterable<Iterable<unknown>>,
): IterableIterator<Iterable<unknown>> {
  const iterators = toArray(
    map((a) => toIterator(a), iterable as Iterable<Iterable<unknown>>),
  );

  return pipe(
    range(Infinity),
    map(() => toArray(map((it) => it.next(), iterators))),
    takeWhile(every((cur2) => !cur2.done)),
    map((cur1) => toArray(map((cur2) => cur2.value, cur1))),
  );
}

function async(
  iterable: Iterable<UniversalIterable>,
): AsyncIterableIterator<UniversalIterable> {
  const iterators = toArray(map(toIterator, iterable as any));

  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next() {
      const headIterators = await pipe(
        toAsync(iterators),
        map((it) => it.next()),
        toArray,
      );

      const hasDone = headIterators.some((it) => it.done);
      if (hasDone) {
        return { done: true, value: undefined };
      }

      return {
        done: false,
        value: headIterators.map((it) => it.value),
      };
    },
  };
}

/**
 * Merges the values of each of the arrays with the values at the corresponding position together.
 * Useful when you have separate data sources that are coordinated through matching array indices.
 *
 * @example
 * ```ts
 * const iter = zip([1, 2, 3, 4], [5, 6, 7, 8]);
 * iter.next() // {done:false, value: [1, 5]}
 * iter.next() // {done:false, value: [2, 6]}
 * iter.next() // {done:false, value: [3, 7]}
 * iter.next() // {done:false, value: [4, 8]}
 * iter.next() // {done:true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  [5, 6, 7, 8],
 *  zip([1, 2, 3, 4]),
 *  toArray,
 * ); // [[1, 5], [2, 6], [3, 7], [4, 8]]
 *
 * await pipe(
 *  Promise.resolve([5, 6, 7, 8]),
 *  zip([1, 2, 3, 4]),
 *  toArray,
 * );  // [[1, 5], [2, 6], [3, 7], [4, 8]]
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(5), Promise.resolve(6), Promise.resolve(7), Promise.resolve(8)],
 *  toAsync,
 *  zip([1, 2, 3, 4]),
 *  toArray,
 * );  // [[1, 5], [2, 6], [3, 7], [4, 8]]
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-zip-81jnh | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
function zip<T extends UniversalIterable, TS extends UniversalIterable[]>(
  a: T,
): (...args: TS) => ReturnZipType<[T, ...TS]>;

// prettier-ignore
function zip<T extends UniversalIterable[]>(
  ...args: T
): ReturnZipType<[...T]>;

function zip<TS extends UniversalIterable[]>(
  ...iterables: TS[]
): ReturnZipType<TS> | ((...iterables: TS[]) => ReturnZipType<TS>) {
  if (iterables.length < 2) {
    return (...iterables2: UniversalIterable[]) => {
      return zip(...iterables, ...iterables2) as ReturnZipType<TS>;
    };
  }

  if (iterables.some((a) => !isIterable(a) && !isAsyncIterable(a))) {
    throw new TypeError("iterable must be type of Iterable or AsyncIterable");
  }

  const hasAsyncIterable = iterables.some((iterable) =>
    isAsyncIterable(iterable),
  );

  if (hasAsyncIterable) {
    return async(iterables) as ReturnZipType<TS>;
  }

  return sync(iterables as Iterable<Iterable<unknown>>[]) as ReturnZipType<TS>;
}

export default zip;
