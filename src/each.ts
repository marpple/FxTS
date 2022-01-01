import IterableInfer from "./types/IterableInfer";
import ReturnValueType from "./types/ReturnValueType";
import { isAsyncIterable, isIterable } from "./_internal/utils";

function sync<A, B = unknown>(f: (a: A) => B, iterable: Iterable<A>): void {
  for (const a of iterable) {
    f(a);
  }
}

async function async<A, B = unknown>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): Promise<void> {
  for await (const item of iterable) {
    const value = f(item);
    if (value instanceof Promise) {
      await value;
    }
  }
}

/**
 * Iterates over Iterable/AsyncIterable, applying each in turn to `f`.
 *
 * @example
 * ```ts
 * each(console.log, [1, 2, 3]); // log 1, 2, 3
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-each-kvz6w | Try It}
 */
// prettier-ignore
function each<A, B = unknown>(
  f: (a: A) => B,
  iterable: Iterable<A>
): void;

function each<A, B = unknown>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): Promise<void>;

function each<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B = unknown,
>(f: (a: IterableInfer<A>) => B): (iterable: A) => ReturnValueType<A, void>;

function each<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: IterableInfer<A>) => B,
  iterable?: A,
): void | Promise<void> | ((iterable: A) => ReturnValueType<A, void>) {
  if (iterable === undefined) {
    return (iterable: A): ReturnValueType<A, void> => {
      return each(f, iterable as any) as ReturnValueType<A, void>;
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

export default each;
