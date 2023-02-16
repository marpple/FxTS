import type Arrow from "./types/Arrow";
import type Cast from "./types/Cast";
import type Append from "./types/Append";
import type Tail from "./types/Tail";
import type Head from "./types/Head";

/*
 * HeadEach<[[1,2,3], [4,5,6], [7,8,9]]> => [1, 4, 7]
 */
type HeadEach<T extends any[][], R extends any[] = []> = T extends [
  any[],
  ...any,
]
  ? HeadEach<Cast<Tail<T>, any[][]>, Append<R, Head<T[0]>>>
  : R;

/*
 * TailEach<[[1,2,3], [4,5,6], [7,8,9]]> => [[2,3], [5,6], [8,9]]
 */
type TailEach<T extends any[][], R extends any[] = []> = T extends [
  any[],
  ...any,
]
  ? TailEach<Cast<Tail<T>, any[][]>, Append<R, Tail<T[0]>>>
  : R;

/*
 * Zip<[[1, 2, 3], ['a', 'b'], [true, false, true]]> => [[1, 'a', true], [2, 'b', false], [3, never, true]]
 */
type Zip<T extends any[][], R extends any[] = []> = T[number] extends []
  ? R
  : Zip<TailEach<T>, Append<R, HeadEach<T>>>;

/*
 * Sum<[{a: 1}, {b: 2}, {c: 3}]> => {a: 1, b: 2, c: 3}
 */
type Sum<T extends any[], R = T[0]> = T extends [any, ...any]
  ? Sum<Tail<T>, R & T[0]>
  : R;

/*
 * SumEach<[[1, 2], ['a', 'b'], [true, false]]> => [1 & 2, 'a' & 'b', true & false]
 */
type SumEach<A extends any[][], R extends any[] = []> = A extends [
  any[],
  ...any,
]
  ? SumEach<Cast<Tail<A>, any[][]>, Append<R, Sum<Head<A>>>>
  : R;

/*
 * ParamTuples<[
 *   (a: number, b: string) => any,
 *   (a: string, b: number) => any
 * ]> => [[number, string], [string, number]]
 */
type ParamTuples<
  FS extends Array<Arrow>,
  Tuples extends any[] = [],
> = FS extends [Arrow, ...Array<Arrow>]
  ? ParamTuples<Cast<Tail<FS>, Array<Arrow>>, Append<Tuples, Parameters<FS[0]>>>
  : Tuples;

type JuxtArgs<
  FS extends Array<Arrow>,
  ARGS extends any[] = ParamTuples<FS>,
> = Cast<ARGS[0] extends Sum<ARGS> ? ARGS[0] : SumEach<Zip<ARGS>>, any[]>;

type JuxtReturnTypes<
  FS extends Array<Arrow>,
  R extends any[] = [],
> = FS extends [Arrow, ...Array<Arrow>]
  ? JuxtReturnTypes<Cast<Tail<FS>, Array<Arrow>>, Append<R, ReturnType<FS[0]>>>
  : R;

/**
 * `juxt` applies a list of functions to a list of values.
 *
 * @example
 * ```ts
 * const range = juxt([Math.min, Math.max])(1, 2, 3, 4); // [1, 4]
 *
 * // with pipe
 * const entries = (obj: { a: number; b: number }) =>
 *   pipe(
 *     [Object.keys, Object.values] as const,
 *     juxt,
 *     (f) => f(obj),
 *     apply(zip),
 *     toArray,
 *   );
 *
 * entries({ a: 1, b: 2 }); // [ ["a", 1], ["b", 2] ]
 * ```
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/apply | apply}
 */

function juxt<FS extends Array<Arrow>>(
  fs: readonly [...FS],
): (...args: JuxtArgs<FS>) => JuxtReturnTypes<FS> {
  return (...args: JuxtArgs<FS>) =>
    fs.map((f) => f(...(args as any))) as JuxtReturnTypes<FS>;
}

export default juxt;
