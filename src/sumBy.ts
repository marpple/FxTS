import { AsyncFunctionException } from "./_internal/error";
import { isAsyncIterable, isIterable, isPromise } from "./_internal/utils";
import type IterableInfer from "./types/IterableInfer";
import type ReturnValueType from "./types/ReturnValueType";

function sync<A>(f: (a: A) => number, iterable: Iterable<A>): number {
  let acc = 0;
  for (const item of iterable) {
    const value = f(item) as number | Promise<number>;
    if (isPromise(value)) {
      throw new AsyncFunctionException();
    }
    acc += value;
  }
  return acc;
}

async function async<A>(
  f: (a: A) => number,
  iterable: AsyncIterable<A>,
): Promise<number> {
  let acc = 0;
  for await (const item of iterable) {
    acc += await f(item);
  }
  return acc;
}

/**
 * Returns the sum of the values produced by applying `f` to each element of
 * the given Iterable/AsyncIterable. Returns `0` for an empty iterable.
 *
 * @example
 * ```ts
 * sumBy((a) => a.price, [
 *   { name: "apple", price: 100 },
 *   { name: "banana", price: 200 },
 * ]); // 300
 *
 * sumBy((a) => a.price, []); // 0
 *
 * // with pipe
 * pipe(
 *   [{ price: 100 }, { price: 200 }],
 *   sumBy((a) => a.price),
 * ); // 300
 * ```
 */
function sumBy<A>(f: (a: A) => number, iterable: Iterable<A>): number;

function sumBy<A>(
  f: (a: A) => number,
  iterable: AsyncIterable<A>,
): Promise<number>;

function sumBy<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: (a: IterableInfer<A>) => number,
): (iterable: A) => ReturnValueType<A, number>;

function sumBy<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: (a: IterableInfer<A>) => number,
  iterable?: A,
): number | Promise<number> | ((iterable: A) => ReturnValueType<A, number>) {
  if (iterable === undefined) {
    return (iterable: A): ReturnValueType<A, number> => {
      return sumBy(f, iterable as any) as ReturnValueType<A, number>;
    };
  }

  if (isIterable<IterableInfer<A>>(iterable)) {
    return sync(f, iterable);
  }

  if (isAsyncIterable<IterableInfer<A>>(iterable)) {
    return async(f, iterable);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default sumBy;
