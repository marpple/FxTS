import pipe1 from "./pipe1";
import Arrow from "./types/Arrow";
import IterableInfer from "./types/IterableInfer";
import ReturnValueType from "./types/ReturnValueType";
import { isAsyncIterable, isIterable } from "./_internal/utils";

function sync<A, B>(f: (a: B, b: A) => B, acc: B, iterable: Iterable<A>): B {
  for (const a of iterable) {
    acc = f(acc, a);
  }
  return acc;
}

async function async<A, B>(
  f: (a: B, b: A) => B,
  acc: Promise<B>,
  iterable: AsyncIterable<A>,
) {
  for await (const a of iterable) {
    // becauseof using es5, use `await`
    acc = await pipe1(acc, (acc) => f(acc as B, a));
  }
  return acc;
}

/**
 * Also known as foldl, reduce boils down a list of values into a single value.
 *
 * @example
 * ```ts
 * const sum = (a:number, b:number) => a + b;
 * reduce(sum, [1, 2, 3, 4]); // 10
 * reduce(sum, 0, [1, 2, 3, 4]); // 10
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3, 4],
 *  map(a => a + 10),
 *  filter(a => a % 2 === 0),
 *  reduce(sum),
 * ); // 26
 *
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4]),
 *  map((a) => a + 10),
 *  filter(a => a % 2 === 0),
 *  reduce(sum),
 * ); // 26
 *
 * // if you want to use asynchronous callback
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4]),
 *  toAsync,
 *  map(async (a) => a + 10),
 *  filter(a => a % 2 === 0),
 *  reduce(sum),
 * ); // 26
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3), Promise.resolve(4)],
 *  toAsync,
 *  map(a => a + 10),
 *  filter(a => a % 2 === 0),
 *  reduce(sum),
 * ); // 26
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-reduce-tf56j  | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/map | map}, {@link https://fxts.dev/docs/filter | filter}
 */

function reduce<A extends readonly []>(f: Arrow, iterable: A): undefined;

function reduce<A extends readonly [], B>(f: Arrow, seed: B, iterable: A): B;

function reduce<A>(f: (a: A, b: A) => A, iterable: Iterable<A>): A;

function reduce<A, B>(f: (a: B, b: A) => B, iterable: Iterable<A>): B;

function reduce<A, B>(f: (a: B, b: A) => B, seed: B, iterable: Iterable<A>): B;

function reduce<A, B>(
  f: (a: B, b: A) => B | Promise<B>,
  seed: B | Promise<B>,
  iterable: AsyncIterable<A>,
): Promise<B>;

function reduce<A, B>(
  f: (a: B, b: A) => B | Promise<B>,
  iterable: AsyncIterable<A>,
): Promise<B>;

function reduce<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: (
    a: IterableInfer<A>,
    b: IterableInfer<A>,
  ) => IterableInfer<A> | Promise<IterableInfer<A>>,
): (iterable: A) => ReturnValueType<A, IterableInfer<A>>;

function reduce<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: B, b: IterableInfer<A>) => B | Promise<B>,
): (iterable: A) => ReturnValueType<A, B>;

function reduce<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: B, b: IterableInfer<A>) => B,
  seed?: B | Iterable<IterableInfer<A>> | AsyncIterable<IterableInfer<A>>,
  iterable?: Iterable<IterableInfer<A>> | AsyncIterable<IterableInfer<A>>,
):
  | B
  | undefined
  | Promise<B | undefined>
  | ((iterable: A) => ReturnValueType<A, B>) {
  if (iterable === undefined) {
    if (seed === undefined) {
      return (iterable: A) =>
        reduce(f, iterable as any) as ReturnValueType<A, B>;
    }

    if (isIterable(seed)) {
      const iterator = seed[Symbol.iterator]();
      const { done, value } = iterator.next();
      if (done) {
        return undefined;
      }
      return sync(f, value, {
        [Symbol.iterator]() {
          return iterator;
        },
      });
    }

    if (isAsyncIterable(seed)) {
      const iterator = seed[Symbol.asyncIterator]();
      return iterator.next().then(({ done, value }) => {
        if (done) {
          return undefined;
        }
        return async(f, value, {
          [Symbol.asyncIterator]() {
            return iterator;
          },
        });
      });
    }

    throw new TypeError("iterable must be type of Iterable or AsyncIterable");
  }

  if (isIterable(iterable)) {
    return sync(f, seed as B, iterable);
  }

  if (isAsyncIterable(iterable)) {
    return async(f, Promise.resolve(seed as B), iterable);
  }

  throw new TypeError("iterable must be type of Iterable or AsyncIterable");
}

export default reduce;
