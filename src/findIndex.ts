import { isAsyncIterable, isIterable } from "./_internal/utils";
import find from "./find";
import zipWithIndex from "./Lazy/zipWithIndex";
import pipe from "./pipe";
import pipe1 from "./pipe1";
import type Arrow from "./types/Arrow";
import type IterableInfer from "./types/IterableInfer";
import type ReturnValueType from "./types/ReturnValueType";

/**
 * Returns the index of the first element of Iterable/AsyncIterable which matches f, or -1 if no element matches.
 *
 * @example
 * ```ts
 * const arr = [{a:1}, {a:2}, {a:3}]
 * findIndex((obj) =>  obj.a === 1, arr); // 0
 * findIndex((obj) =>  obj.a === 2, arr); // 1
 * findIndex((obj) =>  obj.a === 4, arr); // -1
 * ```
 */
function findIndex<T extends readonly []>(f: Arrow, iterable: T): -1;

function findIndex<T>(f: (a: T) => unknown, iterable: Iterable<T>): number;

function findIndex<T>(
  f: (a: T) => unknown,
  iterable: AsyncIterable<T>,
): Promise<number>;

function findIndex<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: (a: IterableInfer<T>) => unknown,
  iterable?: T,
): (iterable: T) => ReturnValueType<T, number>;

function findIndex<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: (a: IterableInfer<T>) => unknown,
  iterable?: T,
): number | Promise<number> | ((iterable: T) => ReturnValueType<T, number>) {
  if (iterable === undefined) {
    return (iterable: T) =>
      findIndex(f, iterable as any) as ReturnValueType<T, number>;
  }

  if (isIterable(iterable)) {
    return pipe(
      zipWithIndex(iterable) as Iterable<[number, IterableInfer<T>]>,
      find(([, a]) => f(a)),
      (res) => (res ? res[0] : -1),
    );
  }

  if (isAsyncIterable(iterable)) {
    return pipe(
      zipWithIndex(iterable) as AsyncIterable<[number, IterableInfer<T>]>,
      find(([, a]) => pipe1(a, f)),
      (res) => (res ? res[0] : -1),
    );
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default findIndex;
