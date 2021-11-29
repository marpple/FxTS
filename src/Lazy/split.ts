import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import { isAsyncIterable, isIterable } from "../_internal/utils";
import concurrent, { isConcurrent } from "./concurrent";

function* sync(sep: string, iterable: Iterable<string>) {
  let acc = [];
  for (const chr of iterable) {
    if (chr === sep) {
      yield acc.join("");
      acc = [];
    } else if (sep === "") {
      yield chr;
      acc = [];
    } else {
      acc.push(chr);
    }
  }

  if (acc.length > 0) {
    yield acc.join("");
  } else if (sep !== "") {
    yield "";
  }
}

async function* asyncSequential(sep: string, iterable: AsyncIterable<string>) {
  let acc = [];
  for await (const chr of iterable) {
    if (chr === sep) {
      yield acc.join("");
      acc = [];
    } else if (sep === "") {
      yield chr;
      acc = [];
    } else {
      acc.push(chr);
    }
  }

  if (acc.length > 0) {
    yield acc.join("");
  } else if (sep !== "") {
    yield "";
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

  if (isIterable(iterable)) {
    return sync(sep, iterable as Iterable<string>);
  }

  if (isAsyncIterable(iterable)) {
    return async(sep, iterable as AsyncIterable<string>);
  }

  throw new TypeError("iterable must be type of Iterable or AsyncIterable");
}

export default split;
