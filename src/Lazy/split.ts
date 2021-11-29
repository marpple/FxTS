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

function split(
  sep: string,
  str: Iterable<string> | AsyncIterable<string>,
): IterableIterator<string> | AsyncIterableIterator<string> {
  if (isIterable(str)) {
    return sync(sep, str);
  }

  if (isAsyncIterable(str)) {
    return async(sep, str);
  }

  throw new TypeError("iterable must be type of Iterable or AsyncIterable");
}

export default split;
