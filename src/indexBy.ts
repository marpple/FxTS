import { AsyncFunctionException } from "./_internal/error";
import { isAsyncIterable, isIterable, isPromise } from "./_internal/utils";
import reduce from "./reduce";
import type Cast from "./types/Cast";
import type Equals from "./types/Equals";
import type { GetKeyOf } from "./types/GetKeyOf";
import type IterableInfer from "./types/IterableInfer";
import type Key from "./types/Key";
import type ReturnValueType from "./types/ReturnValueType";

/**
 * Given `f` that generates a key,
 * turns a list of objects into an object indexing the objects by the given key.
 * Note that if multiple objects generate the same value for the indexing key only the last value will be included in the generated object.
 *
 * @example
 * ```ts
 * const given = [
 *   { category: "clothes", desc: "good" },
 *   { category: "pants", desc: "bad" },
 *   { category: "shoes", desc: "not bad" },
 * ];
 *
 * indexBy(a => a.category, given);
 * // {
 * //   clothes: { category: "clothes", desc: "good" },
 * //   pants: { category: "pants", desc: "bad" },
 * //   shoes: { category: "shoes", desc: "not bad" },
 * // };
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-indexby-zpeok | Try It}
 */

function indexBy<A extends Key>(
  f: (a: A) => A,
  iterable: Iterable<A>,
): { [K in A]: K };

function indexBy<A extends Key>(
  f: (a: A) => A | Promise<A>,
  iterable: AsyncIterable<A>,
): Promise<{ [K in A]: K }>;

function indexBy<A extends object, B extends Key & A[keyof A]>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): {
  [K in B]: A & { [K2 in GetKeyOf<A, B>]: K };
};

function indexBy<A extends object, B extends Key & A[keyof A]>(
  f: (a: A) => B | Promise<B>,
  iterable: AsyncIterable<A>,
): Promise<{
  [K in B]: A & { [K2 in GetKeyOf<A, B>]: K };
}>;

function indexBy<
  I extends Iterable<unknown> | AsyncIterable<unknown>,
  F extends (a: IterableInfer<I>) => any,
>(
  f: F,
): (iterable: I) => ReturnValueType<
  I,
  Equals<Awaited<ReturnType<F>>, IterableInfer<I>> extends 1
    ? {
        [key1 in Awaited<ReturnType<F>>]: key1;
      }
    : {
        [key1 in Awaited<ReturnType<F>>]: IterableInfer<I> & {
          [key2 in GetKeyOf<Cast<IterableInfer<I>, object>, key1>]: key1;
        };
      }
>;

function indexBy<A, B extends Key>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): { [K in B]: A };

function indexBy<A, B extends Key>(
  f: (a: A) => B | Promise<B>,
  iterable: AsyncIterable<A>,
): Promise<{ [K in B]: A }>;

function indexBy<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B extends Key,
>(
  f: (a: IterableInfer<A>) => B | Promise<B>,
): (iterable: A) => ReturnValueType<A, { [K in B]: IterableInfer<A> }>;

function indexBy<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B extends Key,
>(
  f: (a: IterableInfer<A>) => B | Promise<B>,
  iterable?: A,
):
  | { [K in B]: IterableInfer<A> }
  | Promise<{ [K in B]: IterableInfer<A> }>
  | ((iterable: A) => ReturnValueType<A, { [K in B]: IterableInfer<A> }>) {
  if (iterable === undefined) {
    return (
      iterable: A,
    ): ReturnValueType<A, { [K in B]: IterableInfer<A> }> => {
      return indexBy(f, iterable as any) as ReturnValueType<
        A,
        { [K in B]: IterableInfer<A> }
      >;
    };
  }

  const obj = {} as { [K in B]: IterableInfer<A> };
  if (isIterable<IterableInfer<A>>(iterable)) {
    return reduce(
      (group, a) => {
        const key = f(a);
        if (isPromise(key)) {
          throw new AsyncFunctionException();
        }
        return (group[key] = a), group;
      },
      obj,
      iterable,
    );
  }

  if (isAsyncIterable<IterableInfer<A>>(iterable)) {
    return reduce(
      async (group, a) => {
        const key = await f(a);
        return (group[key] = a), group;
      },
      obj,
      iterable,
    );
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default indexBy;
