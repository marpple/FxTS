import type ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import { isAsyncIterable, isIterable } from "../_internal/utils";
import concurrent, { isConcurrent } from "./concurrent";

function* sync(sep: string, iterable: Iterable<string>) {
  if (sep === "") {
    return yield* iterable;
  }

  let acc = "";
  let chr = "";
  for (chr of iterable) {
    if (chr === sep) {
      yield acc;
      acc = "";
    } else {
      acc += chr;
    }
  }

  if (chr === sep) {
    yield "";
  } else if (acc.length > 0) {
    yield acc;
  }
}

async function* asyncSequential(sep: string, iterable: AsyncIterable<string>) {
  if (sep === "") {
    return yield* iterable;
  }

  let acc = "";
  let chr = "";

  for await (chr of iterable) {
    if (chr === sep) {
      yield acc;
      acc = "";
    } else {
      acc += chr;
    }
  }

  if (chr === sep) {
    yield "";
  } else if (acc.length > 0) {
    yield acc;
  }
}

function async(
  sep: string,
  iterable: AsyncIterable<string>,
): AsyncIterableIterator<string> {
  let _iterator: AsyncIterator<string>;
  return {
    async next(_concurrent: any) {
      if (_iterator === undefined) {
        _iterator = isConcurrent(_concurrent)
          ? asyncSequential(sep, concurrent(_concurrent.length, iterable))
          : asyncSequential(sep, iterable);
      }
      return _iterator.next(_concurrent);
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

/**
 * Splits string by separator.
 *
 * @example
 * ```ts
 * const iter = split(',', '1,2,3,4');
 * iter.next(); // 1
 * iter.next(); // 2
 * iter.next(); // 3
 * iter.next(); // 4
 * iter.next(); // undefined
 *
 * // with pipe
 * pipe(
 *  "1,2,3,4,5",
 *  split(','),
 *  toArray,
 * ); // ["1", "2", "3", "4", "5"]
 * ```
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toArray | toArray}
 */
function split(
  sep: string,
  iterable: Iterable<string>,
): IterableIterator<string>;

function split(
  sep: string,
  iterable: AsyncIterable<string>,
): AsyncIterableIterator<string>;

function split<A extends Iterable<string> | AsyncIterable<string>>(
  sep: string,
): (iterable: A) => ReturnIterableIteratorType<A, string>;

function split<A extends Iterable<string> | AsyncIterable<string>>(
  sep: string,
  iterable?: A,
):
  | IterableIterator<string>
  | AsyncIterableIterator<string>
  | ((iterable: A) => ReturnIterableIteratorType<A, string>) {
  if (iterable === undefined) {
    return (iterable: A): ReturnIterableIteratorType<A, string> => {
      return split(sep, iterable as any) as ReturnIterableIteratorType<
        A,
        string
      >;
    };
  }

  if (isIterable<string>(iterable)) {
    return sync(sep, iterable);
  }

  if (isAsyncIterable<string>(iterable)) {
    return async(sep, iterable);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default split;
