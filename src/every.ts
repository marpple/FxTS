import { throwIfPromiseError } from "./_internal/error";
import { isAsyncIterable, isIterable } from "./_internal/utils";
import map from "./Lazy/map";
import takeUntilInclusive from "./Lazy/takeUntilInclusive";
import not from "./not";
import pipe from "./pipe";
import reduce from "./reduce";
import type Arrow from "./types/Arrow";
import type IterableInfer from "./types/IterableInfer";
import type ReturnValueType from "./types/ReturnValueType";

/**
 * Returns true if all of the values in Iterable/AsyncIterable pass the `f` truth test.
 *
 * @example
 * ```ts
 * every((a) => a % 2 === 0, [2, 4, 6, 8, 10]);
 * // true
 *
 * every((a) => a % 2 === 0, [2, 4, 6, 7, 10]);
 * // false
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-every-g91dh | Try It}
 */

function every<A extends readonly []>(f: Arrow, iterable: A): true;

// prettier-ignore
function every<A, B = unknown>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): boolean;

function every<A, B = unknown>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): Promise<boolean>;

function every<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B = unknown,
>(f: (a: IterableInfer<A>) => B): (a: A) => ReturnValueType<A, boolean>;

function every<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B = unknown,
>(
  f: (a: IterableInfer<A>) => B,
  iterable?: A,
): boolean | Promise<boolean> | ((iterable: A) => ReturnValueType<A, boolean>) {
  if (iterable === undefined) {
    return (iterable: A) => {
      return every(f, iterable as any) as ReturnValueType<A, boolean>;
    };
  }

  if (isIterable<IterableInfer<A>>(iterable)) {
    return pipe(
      map((a) => throwIfPromiseError(f(a)), iterable),
      takeUntilInclusive(not),
      (acc) =>
        reduce(
          (a: boolean, b: boolean) => a && b,
          true,
          acc as Iterable<boolean>,
        ),
      (a) => a ?? true,
      Boolean,
    );
  }

  if (isAsyncIterable<IterableInfer<A>>(iterable)) {
    return pipe(
      map(f, iterable),
      takeUntilInclusive(not),
      (acc) =>
        reduce(
          (a: boolean, b: boolean) => a && b,
          true,
          acc as AsyncIterable<boolean>,
        ),
      (a) => a ?? true,
      Boolean,
    );
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default every;
