import Key from "./types/Key";
import ReturnValueType from "./types/ReturnValueType";
import IterableInfer from "./types/IterableInfer";
import { isAsyncIterable, isIterable } from "./_internal/utils";
import { AsyncFunctionException } from "./_internal/error";
import reduce from "./reduce";

function incSel<B extends Key>(parent: { [K in B]: number }, k: B) {
  parent[k] ? parent[k]++ : (parent[k] = 1);
  return parent;
}

/**
 * Returns a count for the number of objects in each group.
 * Similar to groupBy, but instead of returning a list of values,
 * it returns a count for the number of values in that group.
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
 * countBy((a) => a.category, given);
 * //{
 * //  clothes: 1,
 * //  pants: 2,
 * //  shoes: 2,
 * // };
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-countby-09t7z | Try It}
 */

function countBy<A, B extends Key>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): { [K in B]: number };

function countBy<A, B extends Key>(
  f: (a: A) => B | Promise<B>,
  iterable: AsyncIterable<A>,
): Promise<{ [K in B]: number }>;

function countBy<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B extends Key,
>(
  f: (a: IterableInfer<A>) => B | Promise<B>,
): (iterable: A) => ReturnValueType<A, { [K in B]: number }>;

function countBy<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B extends Key,
>(
  f: (a: IterableInfer<A>) => B | Promise<B>,
  iterable?: A,
):
  | { [K in B]: number }
  | Promise<{ [K in B]: number }>
  | ((iterable: A) => ReturnValueType<A, { [K in B]: number }>) {
  if (iterable === undefined) {
    return (iterable: A): ReturnValueType<A, { [K in B]: number }> => {
      return countBy(f, iterable as any) as ReturnValueType<
        A,
        { [K in B]: number }
      >;
    };
  }

  const obj = {} as { [K in B]: number };

  if (isIterable(iterable)) {
    return reduce(
      (group, a) => {
        const key = f(a);
        if (key instanceof Promise) {
          throw new AsyncFunctionException();
        }
        return incSel(group, key);
      },
      obj,
      iterable as Iterable<IterableInfer<A>>,
    );
  }

  if (isAsyncIterable(iterable)) {
    return reduce(
      async (group, a) => {
        const key = await f(a);
        return incSel(group, key);
      },
      obj,
      iterable as AsyncIterable<IterableInfer<A>>,
    );
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default countBy;
