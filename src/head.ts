import { isAsyncIterable, isIterable } from "./_internal/utils";
import take from "./Lazy/take";
import pipe from "./pipe";
import toArray from "./toArray";

type HeadReturnType<T> = T extends readonly [a: infer H, ...rest: any[]]
  ? H
  : T extends readonly never[]
  ? undefined
  : T extends AsyncIterable<infer U>
  ? Promise<U | undefined>
  : T extends Iterable<infer U>
  ? U | undefined
  : never;

/**
 * Returns the first element of Iterable/AsyncIterable.
 *
 * @example
 * ```ts
 * head([1, 2, 3, 4, 5]); // 1
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3, 4, 5],
 *  head,
 * ); // 1
 *
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4, 5]),
 *  head,
 * ); // 1
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
 *  toAsync,
 *  head,
 * ); // 1
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-head-4sh8u | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync}
 */
function head<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  iterable: T,
): HeadReturnType<T>;

function head<A>(iterable: Iterable<A> | AsyncIterable<A>) {
  if (isIterable(iterable)) {
    return pipe(take(1, iterable), toArray, ([a]) => a);
  }
  if (isAsyncIterable(iterable)) {
    return pipe(take(1, iterable), toArray, ([a]) => a);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default head;
