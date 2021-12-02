import Key from "./types/Key";
import ReturnValueType from "./types/ReturnValueType";
import IterableInfer from "./types/IterableInfer";
import { isAsyncIterable, isIterable } from "./_internal/utils";
import reduce from "./reduce";
import { AsyncFunctionException } from "./_internal/error";

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
  if (isIterable(iterable)) {
    return reduce(
      (group, a) => {
        const key = f(a);
        if (key instanceof Promise) {
          throw new AsyncFunctionException();
        }
        return (group[key] = a), group;
      },
      obj,
      iterable as Iterable<IterableInfer<A>>,
    );
  }

  if (isAsyncIterable(iterable)) {
    return reduce(
      async (group, a) => {
        const key = await f(a);
        return (group[key] = a), group;
      },
      obj,
      iterable as AsyncIterable<IterableInfer<A>>,
    );
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default indexBy;
