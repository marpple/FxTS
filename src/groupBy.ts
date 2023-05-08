import { AsyncFunctionException } from "./_internal/error";
import { isAsyncIterable, isIterable, isPromise } from "./_internal/utils";
import reduce from "./reduce";
import type IterableInfer from "./types/IterableInfer";
import type iterableInfer from "./types/IterableInfer";
import type Key from "./types/Key";
import type { Prettify } from "./types/Prettify";
import type ReturnValueType from "./types/ReturnValueType";
import type { GroupBy } from "./types/groupBy";

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
): Prettify<GroupBy<A, B>>;

function groupBy<A, B extends Key>(
  f: (a: A) => B | Promise<B>,
  iterable: AsyncIterable<A>,
): Promise<Prettify<GroupBy<A, B>>>;

function groupBy<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B extends Key,
>(
  f: (a: IterableInfer<A>) => B | Promise<B>,
): (iterable: A) => ReturnValueType<A, Prettify<GroupBy<IterableInfer<A>, B>>>;

function groupBy<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B extends Key,
>(
  f: (a: IterableInfer<A>) => B | Promise<B>,
  iterable?: A,
):
  | Prettify<GroupBy<A, B>>
  | Promise<Prettify<GroupBy<A, B>>>
  | ((iterable: A) => ReturnValueType<A, Prettify<GroupBy<A, B>>>) {
  if (iterable === undefined) {
    return (iterable: A): ReturnValueType<A, GroupBy<A, B>> => {
      return groupBy(f, iterable as any) as unknown as ReturnValueType<
        A,
        GroupBy<A, B>
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
    ) as unknown as GroupBy<A, B>;
  }

  if (isAsyncIterable<iterableInfer<A>>(iterable)) {
    const reulst = reduce(
      async (group, a) => {
        const key = await f(a);
        return (group[key] || (group[key] = [])).push(a), group;
      },
      obj,
      iterable,
    );
    return reulst as unknown as Promise<GroupBy<A, B>>;
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default groupBy;
