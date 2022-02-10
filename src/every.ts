import reduce from "./reduce";
import map from "./Lazy/map";
import takeUntil from "./Lazy/takeUntil";
import not from "./not";
import pipe from "./pipe";
import { isAsyncIterable, isIterable } from "./_internal/utils";
import IterableInfer from "./types/IterableInfer";
import ReturnValueType from "./types/ReturnValueType";
import Arrow from "./types/Arrow";
import { UniversalIterable } from "./types/Utils";

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

function every<A extends UniversalIterable<unknown>, B = unknown>(
  f: (a: IterableInfer<A>) => B,
): (a: A) => ReturnValueType<A, boolean>;

function every<A extends UniversalIterable<unknown>, B = unknown>(
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
      map(f, iterable),
      takeUntil(not),
      reduce((a, b) => a && b),
      (a) => a ?? true,
      Boolean,
    );
  }

  if (isAsyncIterable<IterableInfer<A>>(iterable)) {
    return pipe(
      map(f, iterable),
      takeUntil(not),
      reduce((a, b) => a && b),
      (a) => a ?? true,
      Boolean,
    );
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default every;
