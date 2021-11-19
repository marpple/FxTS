import IterableInfer from "./types/IterableInfer";
import ReturnPartitionType from "./types/ReturnPartitionType";
import { isAsyncIterable, isIterable } from "./_internal/utils";
import groupBy from "./groupBy";
import { AsyncFunctionException } from "./_internal/error";

/**
 * Split Iterable/AsyncIterable into two arrays:
 * one whose elements all satisfy `f` and one whose elements all do not satisfy `f`.
 *
 * @example
 * ```ts
 * partition((a) => a % 2 === 0, [1, 2, 3, 4, 5]); // [[2, 4], [1, 3, 5]]
 *
 * // with pipe
 * pipe(
 *   [1, 2, 3, 4, 5],
 *   partition((a) => a % 2 === 0), // [[2, 4], [1, 3, 5]]
 * );
 *
 * await pipe(
 *   Promise.resolve([1, 2, 3, 4, 5]),
 *   partition((a) => a % 2 === 0), // [[2, 4], [1, 3, 5]]
 * );
 *
 * // if you want to use asynchronous callback
 * await pipe(
 *   Promise.resolve([1, 2, 3, 4, 5]),
 *   toAsync,
 *   partition(async (a) => a % 2 === 0), // [[2, 4], [1, 3, 5]]
 * );
 *
 * // with toAsync
 * await pipe(
 *   [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3), Promise.resolve(4), Promise.resolve(5)],
 *   toAsync,
 *   partition((a) => a % 2 === 0), // [[2, 4], [1, 3, 5]]
 * );
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-partition-7vns0 | Try It}
 *
 *  see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync}
 */
function partition<A, B>(f: (a: A) => B, iterable: Iterable<A>): [A[], A[]];

function partition<A, B>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): Promise<[A[], A[]]>;

function partition<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: IterableInfer<A>) => B,
): (iterable: A) => ReturnPartitionType<A>;

function partition<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: IterableInfer<A>) => B,
  iterable?: A,
):
  | [IterableInfer<A>[], IterableInfer<A>[]]
  | Promise<[IterableInfer<A>[], IterableInfer<A>[]]>
  | ((iterable: A) => ReturnPartitionType<A>) {
  if (iterable === undefined) {
    return (iterable: A): ReturnPartitionType<A> => {
      return partition(f, iterable as any) as ReturnPartitionType<A>;
    };
  }

  if (isIterable(iterable)) {
    const group = groupBy((a) => {
      const key = f(a as IterableInfer<A>);
      if (key instanceof Promise) {
        throw new AsyncFunctionException();
      }
      return `${Boolean(key)}`;
    }, iterable as Iterable<IterableInfer<A>>);
    return [group["true"] || [], group["false"] || []];
  }

  if (isAsyncIterable(iterable)) {
    const group = groupBy(
      async (a) => `${Boolean(await f(a as IterableInfer<A>))}`,
      iterable as AsyncIterable<IterableInfer<A>>,
    );
    return group.then((group) => [group["true"] || [], group["false"] || []]);
  }

  throw new TypeError("iterable must be type of Iterable or AsyncIterable");
}

export default partition;
