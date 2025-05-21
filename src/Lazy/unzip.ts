import isUndefined from "../isUndefined";
import max from "../max";
import pipe from "../pipe";
import size from "../size";
import toArray from "../toArray";
import type ReturnZipType from "../types/ReturnZipType";
import type { UniversalIterable } from "../types/Utils";
import filter from "./filter";
import map from "./map";

function* sync(
  iterator: Iterable<Iterable<unknown>>,
): IterableIterator<Iterable<unknown>> {
  const maxLen = pipe(iterator, map(size), max);

  for (let index = 0; index < maxLen; index++) {
    yield pipe(
      iterator,
      map((value) => (value as Array<any>)[index]),
      filter((value) => !isUndefined(value)),
      toArray,
    );
  }
}

/**
 * 설명 설명 설명
 *
 * @example
 * ```ts
 *
 */
function unzip<T extends UniversalIterable, R extends UniversalIterable[]>(
  iterator: T,
): (...args: R) => ReturnZipType<[T, ...R]>;
function unzip<T extends UniversalIterable[]>(
  ...args: T
): ReturnZipType<[...T]>;

function unzip<R extends UniversalIterable[]>(...iterator: R[]) {
  if (size(iterator) < 2)
    return (...args: UniversalIterable[]) =>
      unzip(...iterator, ...args) as ReturnZipType<R>;

  return sync(iterator);
}

export default unzip;
