import { AsyncFunctionException } from "./_internal/error";
import { isAsyncIterable, isIterable, isPromise } from "./_internal/utils";
import type IterableInfer from "./types/IterableInfer";
import type ReturnValueType from "./types/ReturnValueType";

function sync<A>(f: (a: A) => number, iterable: Iterable<A>): A | undefined {
  let result: A | undefined;
  let hasValue = false;
  let bestValue = 0;
  for (const item of iterable) {
    const value = f(item) as number | Promise<number>;
    if (isPromise(value)) {
      throw new AsyncFunctionException();
    }
    if (!hasValue || value < bestValue) {
      hasValue = true;
      bestValue = value;
      result = item;
    }
  }
  return result;
}

async function async<A>(
  f: (a: A) => number,
  iterable: AsyncIterable<A>,
): Promise<A | undefined> {
  let result: A | undefined;
  let hasValue = false;
  let bestValue = 0;
  for await (const item of iterable) {
    const value = await f(item);
    if (!hasValue || value < bestValue) {
      hasValue = true;
      bestValue = value;
      result = item;
    }
  }
  return result;
}

/**
 * Returns the element of the given Iterable/AsyncIterable for which `f`
 * returns the smallest value. Returns `undefined` for an empty iterable.
 * When multiple elements produce the same smallest value, the first one wins.
 *
 * @example
 * ```ts
 * minBy((a) => a.age, [
 *   { name: "a", age: 21 },
 *   { name: "b", age: 41 },
 *   { name: "c", age: 31 },
 * ]); // { name: "a", age: 21 }
 *
 * minBy((a) => a.length, []); // undefined
 *
 * // with pipe
 * pipe(
 *   [{ score: 1 }, { score: 3 }, { score: 2 }],
 *   minBy((a) => a.score),
 * ); // { score: 1 }
 * ```
 */
function minBy<A>(f: (a: A) => number, iterable: Iterable<A>): A | undefined;

function minBy<A>(
  f: (a: A) => number,
  iterable: AsyncIterable<A>,
): Promise<A | undefined>;

function minBy<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: (a: IterableInfer<A>) => number,
): (iterable: A) => ReturnValueType<A, IterableInfer<A> | undefined>;

function minBy<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: (a: IterableInfer<A>) => number,
  iterable?: A,
):
  | IterableInfer<A>
  | undefined
  | Promise<IterableInfer<A> | undefined>
  | ((iterable: A) => ReturnValueType<A, IterableInfer<A> | undefined>) {
  if (iterable === undefined) {
    return (iterable: A): ReturnValueType<A, IterableInfer<A> | undefined> => {
      return minBy(f, iterable as any) as ReturnValueType<
        A,
        IterableInfer<A> | undefined
      >;
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

export default minBy;
