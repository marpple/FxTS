import { AsyncFunctionException } from "./_internal/error";
import { isAsyncIterable, isIterable, isPromise } from "./_internal/utils";
import groupBy from "./groupBy";
import { type ExcludeObject } from "./types/ExcludeObject";
import type IterableInfer from "./types/IterableInfer";
import type ReturnPartitionType from "./types/ReturnPartitionType";

/**
 * Split Iterable/AsyncIterable into two arrays:
 * one with all elements which satisfies `f` and the other with all elements that does not.
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

function partition<
  A,
  L extends A,
  R extends A = A extends object ? ExcludeObject<A, L> : Exclude<A, L>,
>(f: (a: A) => a is L, iterable: Iterable<A>): [L[], R[]];

function partition<
  A,
  L extends A,
  R extends A = A extends object ? ExcludeObject<A, L> : Exclude<A, L>,
>(f: (a: A) => a is L, iterable: AsyncIterable<A>): Promise<[L[], R[]]>;

function partition<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B extends IterableInfer<A>,
  L extends B,
  R extends B = B extends object ? ExcludeObject<B, L> : Exclude<B, L>,
>(
  f: (a: IterableInfer<A>) => a is L,
): (
  iterable: A,
) => A extends AsyncIterable<any> ? Promise<[L[], R[]]> : [L[], R[]];

function partition<A, B>(f: (a: A) => B, iterable: Iterable<A>): [A[], A[]];

function partition<A, B>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): Promise<[A[], A[]]>;

function partition<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: IterableInfer<A>) => B,
): (iterable: A) => ReturnPartitionType<A>;

function partition<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B extends boolean,
>(
  f: (a: IterableInfer<A>) => B,
  iterable?: A,
):
  | [IterableInfer<A>[], IterableInfer<A>[]]
  | Promise<[IterableInfer<A>[], IterableInfer<A>[]]>
  | ((iterable: A) => ReturnPartitionType<A>) {
  if (iterable === undefined) {
    return (iterable: A): ReturnPartitionType<A> => {
      return partition(f, iterable as any) as unknown as ReturnPartitionType<A>;
    };
  }
  if (isIterable<IterableInfer<A>>(iterable)) {
    const group = groupBy((a) => {
      const key = f(a);
      if (isPromise(key)) {
        throw new AsyncFunctionException();
      }
      return `${Boolean(key)}`;
    }, iterable);
    return [group["true"] || [], group["false"] || []] as unknown as [
      IterableInfer<A>[],
      IterableInfer<A>[],
    ];
  }

  if (isAsyncIterable<IterableInfer<A>>(iterable)) {
    const group = groupBy(async (a) => `${Boolean(await f(a))}`, iterable);
    return group.then((group) => [
      group["true"] || [],
      group["false"] || [],
    ]) as Promise<[IterableInfer<A>[], IterableInfer<A>[]]>;
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default partition;
