import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import { isAsyncIterable, isIterable } from "../_internal/utils";

function* sync(sep: string, str: Iterable<string>) {
  let acc = [];
  for (const chr of str) {
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
  }
}

async function* async(sep: string, str: AsyncIterable<string>) {
  let acc = [];
  for await (const chr of str) {
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
  }
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
