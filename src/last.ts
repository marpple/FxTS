import { isAsyncIterable, isIterable } from "./_internal/utils";
import isArray from "./isArray";
import isString from "./isString";
import reduce from "./reduce";

type LastReturnType<T> = T extends readonly [...rest: any[], a: infer L]
  ? L
  : T extends readonly never[]
  ? undefined
  : T extends AsyncIterable<infer U>
  ? Promise<U | undefined>
  : T extends Iterable<infer U>
  ? U | undefined
  : never;

/**
 * Returns the last element of Iterable/AsyncIterable
 *
 * @example
 * ```ts
 * last([1, 2, 3, 4, 5]); // 5
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3, 4, 5],
 *  last,
 * ); // 5
 *
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4, 5]),
 *  last,
 * ); // 5
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
 *  toAsync,
 *  last,
 * ); // 3
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-last-zbvq8 | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync}
 */
function last<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  iterable: T,
): LastReturnType<T>;

function last<A>(iterable: Iterable<A> | AsyncIterable<A> | A[]) {
  if (isArray(iterable) || isString(iterable)) {
    return iterable[iterable.length - 1];
  }
  if (isIterable(iterable)) {
    return reduce((_, a) => a, iterable);
  } else if (isAsyncIterable(iterable)) {
    return reduce((_, a) => a, iterable);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default last;
