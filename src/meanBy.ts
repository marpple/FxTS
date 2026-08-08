import { AsyncFunctionException } from "./_internal/error";
import { isAsyncIterable, isIterable, isPromise } from "./_internal/utils";
import type IterableInfer from "./types/IterableInfer";
import type ReturnValueType from "./types/ReturnValueType";

function sync<A>(f: (a: A) => number, iterable: Iterable<A>): number {
  let acc = 0;
  let count = 0;
  for (const item of iterable) {
    const value = f(item) as number | Promise<number>;
    if (isPromise(value)) {
      throw new AsyncFunctionException();
    }
    acc += value;
    count += 1;
  }
  return acc / count;
}

async function async<A>(
  f: (a: A) => number,
  iterable: AsyncIterable<A>,
): Promise<number> {
  let acc = 0;
  let count = 0;
  for await (const item of iterable) {
    acc += await f(item);
    count += 1;
  }
  return acc / count;
}

/**
 * Returns the average of the values produced by applying `f` to each element
 * of the given Iterable/AsyncIterable. Returns `NaN` for an empty iterable.
 *
 * @example
 * ```ts
 * meanBy((a) => a.score, [
 *   { name: "a", score: 80 },
 *   { name: "b", score: 100 },
 * ]); // 90
 *
 * meanBy((a) => a.score, []); // NaN
 *
 * // with pipe
 * pipe(
 *   [{ score: 80 }, { score: 100 }],
 *   meanBy((a) => a.score),
 * ); // 90
 * ```
 */
function meanBy<A>(f: (a: A) => number, iterable: Iterable<A>): number;

function meanBy<A>(
  f: (a: A) => number,
  iterable: AsyncIterable<A>,
): Promise<number>;

function meanBy<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: (a: IterableInfer<A>) => number,
): (iterable: A) => ReturnValueType<A, number>;

function meanBy<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: (a: IterableInfer<A>) => number,
  iterable?: A,
): number | Promise<number> | ((iterable: A) => ReturnValueType<A, number>) {
  if (iterable === undefined) {
    return (iterable: A): ReturnValueType<A, number> => {
      return meanBy(f, iterable as any) as ReturnValueType<A, number>;
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

export default meanBy;
