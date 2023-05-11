import { AsyncFunctionException } from "./_internal/error";
import { isAsyncIterable, isIterable, isPromise } from "./_internal/utils";
import reduce from "./reduce";
import type Cast from "./types/Cast";
import type Equals from "./types/Equals";
import type { GetKeyOf } from "./types/GetKeyOf";
import type IterableInfer from "./types/IterableInfer";
import type iterableInfer from "./types/IterableInfer";
import type Key from "./types/Key";
import type ReturnValueType from "./types/ReturnValueType";

/**
 * Splits Iterable/AsyncIterable into sets, grouped by the result of running each value through `f`.
 *
 * @example
 * ```ts
 * const given = [
 *   { category: "clothes", desc: "good" },
 *   { category: "pants", desc: "bad" },
 *   { category: "shoes", desc: "not bad" },
 *   { category: "shoes", desc: "great" },
 *   { category: "pants", desc: "good" },
 * ];
 *
 * groupBy((a) => a.category, given);
 * // {
 * //   clothes: [{ category: "clothes", desc: "good" }],
 * //   pants: [
 * //     { category: "pants", desc: "bad" },
 * //     { category: "pants", desc: "good" },
 * //   ],
 * //   shoes: [
 * //     { category: "shoes", desc: "not bad" },
 * //     { category: "shoes", desc: "great" },
 * //   ],
 * // };
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-groupby-v8q3b | Try It}
 */

function groupBy<A extends Key>(
  f: (a: A) => A,
  iterable: Iterable<A>,
): { [K in A]: K[] };

function groupBy<A extends Key>(
  f: (a: A) => A | Promise<A>,
  iterable: AsyncIterable<A>,
): Promise<{ [K in A]: K[] }>;

function groupBy<A extends object, B extends Key & A[keyof A]>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): {
  [K in B]: (A & { [K2 in GetKeyOf<A, B>]: K })[];
};

function groupBy<A extends object, B extends Key & A[keyof A]>(
  f: (a: A) => B | Promise<B>,
  iterable: AsyncIterable<A>,
): Promise<{
  [K in B]: (A & { [K2 in GetKeyOf<A, B>]: K })[];
}>;

function groupBy<
  I extends Iterable<unknown> | AsyncIterable<unknown>,
  F extends (a: IterableInfer<I>) => any,
>(
  f: F,
): (iterable: I) => ReturnValueType<
  I,
  Equals<Awaited<ReturnType<F>>, IterableInfer<I>> extends 1
    ? {
        [key1 in Awaited<ReturnType<F>>]: key1[];
      }
    : {
        [key1 in Awaited<ReturnType<F>>]: (IterableInfer<I> & {
          [key2 in GetKeyOf<Cast<IterableInfer<I>, object>, key1>]: key1;
        })[];
      }
>;

function groupBy<A extends Key, B extends Iterable<A> | AsyncIterable<A>>(
  f: (a: A) => A | Promise<A>,
): (iterable: B) => ReturnValueType<B, { [K in A]: K[] }>;
function groupBy<A, B extends Key>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): { [K in B]: A[] };

function groupBy<A, B extends Key>(
  f: (a: A) => B | Promise<B>,
  iterable: AsyncIterable<A>,
): Promise<{ [K in B]: A[] }>;

function groupBy<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B extends Key,
>(
  f: (a: IterableInfer<A>) => B | Promise<B>,
): (iterable: A) => ReturnValueType<A, { [K in B]: IterableInfer<A>[] }>;

function groupBy<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B extends Key,
>(
  f: (a: IterableInfer<A>) => B | Promise<B>,
  iterable?: A,
):
  | { [K in B]: IterableInfer<A>[] }
  | Promise<{ [K in B]: IterableInfer<A>[] }>
  | ((iterable: A) => ReturnValueType<A, { [K in B]: IterableInfer<A>[] }>) {
  if (iterable === undefined) {
    return (
      iterable: A,
    ): ReturnValueType<A, { [K in B]: IterableInfer<A>[] }> => {
      return groupBy(f, iterable as any) as ReturnValueType<
        A,
        { [K in B]: IterableInfer<A>[] }
      >;
    };
  }

  const obj = {} as { [K in B]: IterableInfer<A>[] };
  if (isIterable<IterableInfer<A>>(iterable)) {
    return reduce(
      (group, a) => {
        const key = f(a);
        if (isPromise(key)) {
          throw new AsyncFunctionException();
        }
        return (group[key] || (group[key] = [])).push(a), group;
      },
      obj,
      iterable,
    );
  }

  if (isAsyncIterable<iterableInfer<A>>(iterable)) {
    return reduce(
      async (group, a) => {
        const key = await f(a);
        return (group[key] || (group[key] = [])).push(a), group;
      },
      obj,
      iterable,
    );
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default groupBy;
