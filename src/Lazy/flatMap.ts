import map from "./map";
import flat from "./flat";
import { isAsyncIterable, isIterable } from "../_internal/utils";
import Awaited from "../types/Awaited";
import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import IterableInfer from "../types/IterableInfer";
import DeepFlat from "../types/DeepFlat";

type FlatMapValue<
  T,
  I extends Iterable<unknown> | AsyncIterable<unknown>,
> = I extends AsyncIterable<any> ? Awaited<T> : T;

/**
 * Returns flattened Iterable/AsyncIterable of values by running each element
 * flattening the mapped results.
 *
 * @example
 * ```ts
 * const iter = flatMap(s => s.split(" "), ["It is", "a good", "day"]);
 * iter.next() // {done:false, value: "It"}
 * iter.next() // {done:false, value: "is"}
 * iter.next() // {done:false, value: "a"}
 * iter.next() // {done:false, value: "good"},
 * iter.next() // {done:false, value: "day"},
 * iter.next() // {done:true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  ["It is", "a good", "day"],
 *  flatMap(s => s.split(" ")),
 *  toArray,
 * ); // ["It", "is", "a", "good", "day"]
 *
 * await pipe(
 *  Promise.resolve(["It is", "a good", "day"]),
 *  flatMap(s => s.split(" ")),
 *  toArray,
 * ); // ["It", "is", "a", "good", "day"]
 *
 * // if you want to use asynchronous callback
 * await pipe(
 *  Promise.resolve(["It is", "a good", "day"]),
 *  toAsync,
 *  flatMap(async (s) => s.split(" ")),
 *  toArray,
 * ); // ["It", "is", "a", "good", "day"]
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-flatmap-3g9k8 | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
function flatMap<A, B = unknown>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): IterableIterator<DeepFlat<B, 1>>;

function flatMap<A, B = unknown>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<DeepFlat<Awaited<B>, 1>>;

function flatMap<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B = unknown,
>(
  f: (a: IterableInfer<A>) => B,
  iterable?: A,
): (
  iterable: A,
) => ReturnIterableIteratorType<A, DeepFlat<FlatMapValue<B, A>, 1>>;

function flatMap<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B = unknown,
>(
  f: (a: IterableInfer<A>) => B,
  iterable?: A,
):
  | IterableIterator<DeepFlat<FlatMapValue<B, A>, 1>>
  | AsyncIterableIterator<DeepFlat<Awaited<B>, 1>>
  | ((iterable: A) => ReturnIterableIteratorType<A, DeepFlat<B, 1>>) {
  if (iterable === undefined) {
    return (iterable: A) => {
      return flat(map(f, iterable as any)) as ReturnIterableIteratorType<
        A,
        DeepFlat<B, 1>
      >;
    };
  }

  if (isIterable(iterable)) {
    return flat(
      map(f, iterable as Iterable<IterableInfer<A>>),
    ) as IterableIterator<DeepFlat<FlatMapValue<B, A>, 1>>;
  }

  if (isAsyncIterable(iterable)) {
    return flat(map(f, iterable as AsyncIterable<Awaited<IterableInfer<A>>>));
  }

  throw new TypeError("iterable must be type of Iterable or AsyncIterable");
}

export default flatMap;
