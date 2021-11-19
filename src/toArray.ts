import ReturnArrayType from "./types/ReturnArrayType";
import { isAsyncIterable, isIterable } from "./_internal/utils";

async function async<A>(iterable: AsyncIterable<A>): Promise<A[]> {
  const res: A[] = [];
  for await (const item of iterable) {
    res.push(item);
  }
  return res;
}

/**
 * Take item from Iterable/AsyncIterable and returns an array
 * It is recommended to use {@link https://fxts.dev/docs/pipe | pipe} together
 *
 * @example
 * ```ts
 * pipe(
 *  [1, 2, 3, 4, 5],
 *  map(a => a + 10),
 *  filter(a => a % 2 === 0),
 *  toArray,
 * ); // [12, 14]
 *
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4, 5]),
 *  map(a => a + 10),
 *  filter(a => a % 2 === 0),
 *  toArray,
 * ); // [12, 14]
 *
 * // if you want to use asynchronous callback
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4, 5]),
 *  toAsync,
 *  map(async (a) => a + 10),
 *  filter(a => a % 2 === 0),
 *  toArray,
 * ); // [12, 14]
 *
 * // with toAsync
 * await pipe(
 *  [
 *    Promise.resolve(1),
 *    Promise.resolve(2),
 *    Promise.resolve(3),
 *    Promise.resolve(4),
 *    Promise.resolve(5)
 *  ],
 *  toAsync,
 *  map((a) => a + 10),
 *  filter((a) => a % 2 === 0),
 *  toArray
 *);
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-toarray-fy84i | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/map | map}, {@link https://fxts.dev/docs/filter | filter}
 */
function toArray<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  iter: A,
): ReturnArrayType<A>;

function toArray<A>(iter: AsyncIterable<A> | Iterable<A>) {
  if (isAsyncIterable(iter)) {
    return async(iter);
  } else if (isIterable(iter)) {
    return Array.from(iter);
  } else {
    return [] as A[];
  }
}

export default toArray;
