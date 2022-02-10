import Key from "./types/Key";
import ReturnValueType from "./types/ReturnValueType";
import IterableInfer from "./types/IterableInfer";
import { isAsyncIterable, isIterable } from "./_internal/utils";
import { AsyncFunctionException } from "./_internal/error";
import reduce from "./reduce";
import iterableInfer from "./types/IterableInfer";
import { UniversalIterable } from "./types/Utils";

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
): { [K in B]: A[] };

function groupBy<A, B extends Key>(
  f: (a: A) => B | Promise<B>,
  iterable: AsyncIterable<A>,
): Promise<{ [K in B]: A[] }>;

function groupBy<A extends UniversalIterable<unknown>, B extends Key>(
  f: (a: IterableInfer<A>) => B | Promise<B>,
): (iterable: A) => ReturnValueType<A, { [K in B]: IterableInfer<A>[] }>;

function groupBy<A extends UniversalIterable<unknown>, B extends Key>(
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
        if (key instanceof Promise) {
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
