import { AsyncFunctionException } from "./_internal/error";
import { isAsyncIterable, isIterable, isPromise } from "./_internal/utils";
import reduce from "./reduce";
import type IterableInfer from "./types/IterableInfer";
import type iterableInfer from "./types/IterableInfer";
import type Key from "./types/Key";
import type ReturnValueType from "./types/ReturnValueType";

type GroupBy<A, B extends Key> = {
  [K in B]: (A extends object
    ? {
        [K2 in keyof A]: A[K2] extends B ? K : A[K2];
      }
    : A)[];
};

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
function groupBy<A, B extends Key>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): GroupBy<A, B>;

function groupBy<A, B extends Key>(
  f: (a: A) => B | Promise<B>,
  iterable: AsyncIterable<A>,
): Promise<GroupBy<A, B>>;

function groupBy<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B extends Key,
>(
  f: (a: IterableInfer<A>) => B | Promise<B>,
): (iterable: A) => ReturnValueType<A, GroupBy<IterableInfer<A>, B>>;

function groupBy<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B extends Key,
>(
  f: (a: IterableInfer<A>) => B | Promise<B>,
  iterable?: A,
):
  | {
      [K in B]: (A extends object
        ? {
            [K2 in keyof A]: A[K2] extends B ? K : A[K2];
          }
        : A)[];
    }
  | Promise<{
      [K in B]: (A extends object
        ? {
            [K2 in keyof A]: A[K2] extends B ? K : A[K2];
          }
        : A)[];
    }>
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
    ) as {
      [K in B]: (A extends object
        ? {
            [K2 in keyof A]: A[K2] extends B ? K : A[K2];
          }
        : A)[];
    };
  }

  if (isAsyncIterable<iterableInfer<A>>(iterable)) {
    return reduce(
      async (group, a) => {
        const key = await f(a);
        return (group[key] || (group[key] = [])).push(a), group;
      },
      obj,
      iterable,
    ) as {
      [K in B]: (A extends object
        ? {
            [K2 in keyof A]: A[K2] extends B ? K : A[K2];
          }
        : A)[];
    };
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default groupBy;
