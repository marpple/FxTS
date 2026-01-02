import { isAsyncIterable, isIterable } from "./_internal/utils";
import pipe1 from "./pipe1";
import type Arrow from "./types/Arrow";
import type IterableInfer from "./types/IterableInfer";
import type { AsyncReducer, SyncReducer } from "./types/Reducer";
import type ReturnValueType from "./types/ReturnValueType";

function sync<T, Acc>(
  f: SyncReducer<Acc, T>,
  acc: Acc,
  iterable: Iterable<T>,
): Acc {
  for (const a of iterable) {
    acc = f(acc, a);
  }
  return acc;
}

async function async<T, Acc>(
  f: SyncReducer<Acc, T>,
  acc: Promise<Acc>,
  iterable: AsyncIterable<T>,
) {
  for await (const a of iterable) {
    // becauseof using es5, use `await`
    acc = await pipe1(acc, (acc) => f(acc as Acc, a));
  }
  return acc;
}

/**
 * Also known as foldl, this method boils down a list of values into a single value.
 *
 * @example
 * You can reduce values into homogeneous type.
 *
 * ```ts
 * const sum = (a:number, b:number) => a + b;
 *
 * // with implicit seed with first element
 * reduce(sum, [1, 2, 3, 4]); // 10
 *
 * // with explicit seed
 * reduce(sum, 0, [1, 2, 3, 4]); // 10
 * ```
 *
 * You can reduce values into heterogeneous type.
 *
 * ```ts
 * // reduce { id: number; score: number; } to number
 * reduce((acc, value) => acc + value.score, 0, [
 *  { id: 0, score: 1 },
 *  { id: 5, score: 2 },
 *  { id: 9, score: 3 },
 *  { id: 3, score: 4 }
 * ])
 * ```
 *
 * Omitting iterable will returns function, useful when using with pipe.
 *
 * ```ts
 * pipe(
 *  [1, 2, 3, 4],
 *  map(a => a + 10),
 *  filter(a => a % 2 === 0),
 *  reduce(sum),
 * ); // 26
 * ```
 *
 * For backward compatibility, `reduce` can support partial lazy form.
 * You may want to use `reduceLazy` to use `seed`.
 *
 * ```ts
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
 * see {@link https://fxts.dev/api/pipe | pipe}, {@link https://fxts.dev/api/toAsync | toAsync},
 * {@link https://fxts.dev/api/map | map}, {@link https://fxts.dev/api/filter | filter}
 *
 * @typeParam T - Type of values in `iterable` which would be consummed.
 * @typeParam Acc - Type of `acc` which is the type of accumulative value
 */

function reduce<T extends readonly [], Acc>(
  f: Arrow,
  seed: Acc,
  iterable: T,
): Acc;

function reduce<T>(f: SyncReducer<T, T>, iterable: Iterable<T>): T;

function reduce<T, Acc>(f: SyncReducer<Acc, T>, iterable: Iterable<T>): Acc;

function reduce<T, Acc>(
  f: SyncReducer<Acc, T>,
  seed: Acc,
  iterable: Iterable<T>,
): Acc;

function reduce<T>(
  f: SyncReducer<T, T>,
  iterable: AsyncIterable<T>,
): Promise<T>;

function reduce<T, Acc>(
  f: AsyncReducer<Acc, T>,
  seed: Acc | Promise<Acc>,
  iterable: AsyncIterable<T>,
): Promise<Acc>;

function reduce<T, Acc>(
  f: AsyncReducer<Acc, T>,
  iterable: AsyncIterable<T>,
): Promise<Acc>;

function reduce<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: AsyncReducer<IterableInfer<T>, IterableInfer<T>>,
): (iterable: T) => ReturnValueType<T>;

function reduce<T extends Iterable<unknown> | AsyncIterable<unknown>, Acc>(
  f: AsyncReducer<Acc, IterableInfer<T>>,
): (iterable: T) => ReturnValueType<T, Acc>;

function reduce<T extends Iterable<unknown> | AsyncIterable<unknown>, Acc>(
  f: SyncReducer<Acc, IterableInfer<T>>,
  seed?: Acc | Iterable<IterableInfer<T>> | AsyncIterable<IterableInfer<T>>,
  iterable?: Iterable<IterableInfer<T>> | AsyncIterable<IterableInfer<T>>,
): Acc | Promise<Acc> | ((iterable: T) => ReturnValueType<T, Acc>) {
  if (iterable === undefined) {
    if (seed === undefined) {
      return (iterable: T) =>
        reduce(f, iterable as any) as ReturnValueType<T, Acc>;
    }

    if (isIterable(seed)) {
      const iterator = seed[Symbol.iterator]();
      const { done, value } = iterator.next();
      if (done) {
        throw new TypeError("'reduce' of empty iterable with no initial value");
      }
      return sync(f, value as Acc, {
        [Symbol.iterator]() {
          return iterator;
        },
      });
    }

    if (isAsyncIterable(seed)) {
      const iterator = seed[Symbol.asyncIterator]();
      return iterator.next().then(({ done, value }) => {
        if (done) {
          throw new TypeError(
            "'reduce' of empty iterable with no initial value",
          );
        }

        return async(f, value as Promise<Acc>, {
          [Symbol.asyncIterator]() {
            return iterator;
          },
        });
      });
    }

    throw new TypeError(
      "'iterable' must be type of Iterable or AsyncIterable. Are you looking for 'reduceLazy'?",
    );
  }

  if (isIterable(iterable)) {
    return sync(f, seed as Acc, iterable);
  }

  if (isAsyncIterable(iterable)) {
    return async(f, Promise.resolve(seed as Acc), iterable);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default reduce;
