import { Iter } from "../types/Utils";

export function isIterable<T = unknown>(
  a: Iter<T> | unknown,
): a is Iterable<T> {
  return typeof (a as any)?.[Symbol.iterator] === "function";
}

export function isAsyncIterable<T = unknown>(
  a: Iter<T> | unknown,
): a is AsyncIterable<T> {
  return typeof (a as any)?.[Symbol.asyncIterator] === "function";
}

export function isIterator<T = unknown>(
  a: Iter<T> | unknown,
): a is Iterator<T> | Iterator<Promise<T>> | AsyncIterator<T> {
  return typeof (a as any)?.next === "function";
}

export function toIterator<T>(iterable: Iterable<T>): Iterator<T>;
export function toIterator<T>(iterable: AsyncIterable<T>): AsyncIterator<T>;
export function toIterator<T>(iterable: Iterable<T> | AsyncIterable<T>) {
  if (isIterable(iterable)) {
    return iterable[Symbol.iterator]();
  }
  if (isAsyncIterable(iterable)) {
    return iterable[Symbol.asyncIterator]();
  }
  throw new TypeError(
    "toIterator: iterable must be type of Iterable or AsyncIterable",
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const empty = function* () {};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const asyncEmpty = async function* () {};

export const isNotNullable = <T>(a: T): a is NonNullable<T> =>
  a !== null && a !== undefined;
