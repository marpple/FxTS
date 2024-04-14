import { isAsyncIterable, isIterable } from "../_internal/utils";
import consume from "../consume";
import each from "../each";
import every from "../every";
import find from "../find";
import findIndex from "../findIndex";
import groupBy from "../groupBy";
import indexBy from "../indexBy";
import isUndefined from "../isUndefined";
import join from "../join";
import reduce from "../reduce";
import some from "../some";
import type Cast from "../types/Cast";
import type { DeepFlat } from "../types/DeepFlat";
import type IterableInfer from "../types/IterableInfer";
import type Key from "../types/Key";
import type { SyncReducer } from "../types/Reducer";
import concurrent from "./concurrent";
import drop from "./drop";
import filter from "./filter";
import flat from "./flat";
import flatMap from "./flatMap";
import map from "./map";
import peek from "./peek";
import reject from "./reject";
import slice from "./slice";
import take from "./take";
import takeUntil from "./takeUntil";
import takeWhile from "./takeWhile";
import toAsync from "./toAsync";

class FxAsyncIterable<A> {
  private asyncIterable: AsyncIterable<A>;

  constructor(asyncIterable: AsyncIterable<A>) {
    this.asyncIterable = asyncIterable;
  }

  private [Symbol.asyncIterator]() {
    return this.asyncIterable;
  }

  /**
   * Returns AsyncIterable of values by running each applying `f`.
   *
   * see {@link https://fxts.dev/docs/map | map}
   */
  map<B>(f: (a: A) => B) {
    return new FxAsyncIterable(map(f, this.asyncIterable));
  }

  /**
   * Returns flattened AsyncIterable of values by running each element
   * flattening the mapped results.
   *
   * see {@link https://fxts.dev/docs/flatMap | flatMap}
   */
  flatMap<B>(f: (a: A) => B) {
    return new FxAsyncIterable(flatMap(f, this.asyncIterable));
  }

  /**
   * Returns flattened AsyncIterable.
   * If first argument is number, more perform flatten
   *
   * @example
   * ```
   * await fx([[1],[[2]]])
   *   .toAsync()
   *   .flat(2).toArray(); // [1,2]
   * ```
   *
   * see {@link https://fxts.dev/docs/flat | flat}
   */
  flat<T extends number = 1>(depth?: T) {
    return new FxAsyncIterable(
      flat(this.asyncIterable, depth),
    ) as FxAsyncIterable<DeepFlat<A, T>>;
  }

  /**
   * Return AsyncIterable of all elements `f` returns truthy for
   *
   * see {@link https://fxts.dev/docs/filter | filter}
   */
  filter(f: (a: A) => unknown): FxAsyncIterable<A> {
    return new FxAsyncIterable(filter(f, this.asyncIterable));
  }

  /**
   * The opposite of filter method
   * AsyncIterable of all elements `f` returns falsy for
   *
   * see {@link https://fxts.dev/docs/reject | reject}
   */
  reject(f: (a: A) => unknown): FxAsyncIterable<A> {
    return new FxAsyncIterable(reject(f, this.asyncIterable));
  }

  /**
   * Returns AsyncIterable that taken the first argument `l` values from asyncIterable
   *
   * see {@link https://fxts.dev/docs/take | take}
   */
  take(n: number): FxAsyncIterable<A> {
    return new FxAsyncIterable(take(n, this.asyncIterable));
  }

  /**
   * Returns AsyncIterable that taken values until truthy when given `f` is applied.
   *
   * see {@link https://fxts.dev/docs/takeUntil | takeUntil}
   */
  takeUntil(f: (a: A) => unknown): FxAsyncIterable<A> {
    return new FxAsyncIterable(takeUntil(f, this.asyncIterable));
  }

  /**
   * Returns AsyncIterable that taken values as long as each value satisfies the give `f`.
   *
   * see {@link https://fxts.dev/docs/takeWhile | takeWhile}
   */
  takeWhile(f: (a: A) => unknown): FxAsyncIterable<A> {
    return new FxAsyncIterable(takeWhile(f, this.asyncIterable));
  }

  /**
   * Iterate over an input list,
   * calling a provided `f` for each element in the AsyncIterable.
   *
   * see {@link https://fxts.dev/docs/peek | peek}
   */
  peek(f: (a: A) => unknown): FxAsyncIterable<A> {
    return new FxAsyncIterable(peek(f, this.asyncIterable));
  }

  /**
   * Returns all but the first `length` elements of the given asyncIterable.
   *
   * see {@link https://fxts.dev/docs/drop | drop}
   */
  drop(length: number): FxAsyncIterable<A> {
    return new FxAsyncIterable(drop(length, this.asyncIterable));
  }

  /**
   * Returns AsyncIterable of the given elements from startIndex(inclusive) to endIndex(exclusive).
   *
   * see {@link https://fxts.dev/docs/slice | slice}
   */
  slice(start: number, end?: number): FxAsyncIterable<A> {
    return isUndefined(end)
      ? new FxAsyncIterable(slice(start, this.asyncIterable))
      : new FxAsyncIterable(slice(start, end, this.asyncIterable));
  }

  /**
   *
   * `chain` allows you to use functions that are not provided in method chaining.
   * The functions available for the `chain` argument return an iterable.
   *
   * @example
   * ```
   * await fx(toAsync(range(1, 4)))
   *   .chain(append(4))
   *   .chain(append(5))
   *   .toArray(); // [1, 2, 3, 4, 5]
   * ```
   */
  chain<B>(
    f: (asyncIterable: AsyncIterable<A>) => AsyncIterable<Awaited<B>>,
  ): FxAsyncIterable<B> {
    return new FxAsyncIterable(f(this.asyncIterable));
  }

  /**
   * Concurrent is used to balance the load of multiple asynchronous requests.
   * The first argument receives a number that controls the number of loads, and the second argument is an AsyncIterable.
   *
   * see {@link https://fxts.dev/docs/concurrent | concurrent}
   */
  concurrent(length: number) {
    return new FxAsyncIterable(concurrent(length, this.asyncIterable));
  }

  async consume() {
    return consume(this.asyncIterable);
  }

  /**
   * Splits AsyncIterable into sets, grouped by the result of running each value through `f`.
   *
   * see {@link https://fxts.dev/docs/groupBy | groupBy}
   */
  async groupBy(f: (a: A) => Key) {
    return groupBy(f, this.asyncIterable);
  }

  /**
   * Given `f` that generates a key,
   * turns a list of objects into an object indexing the objects by the given key.
   * Note that if multiple objects generate the same value for the indexing key only the last value will be included in the generated object.
   *
   * see {@link https://fxts.dev/docs/indexBy | indexBy}
   */
  async indexBy(f: (a: A) => Key) {
    return indexBy(f, this.asyncIterable);
  }

  /**
   * Returns true if any of the values in AsyncIterable pass `f` truth test
   *
   * see {@link https://fxts.dev/docs/some | some}
   */
  async some(f: (a: A) => unknown): Promise<boolean> {
    return some(f, this.asyncIterable);
  }

  /**
   * Returns true if all of the values in AsyncIterable pass the `f` truth test.
   *
   * see {@link https://fxts.dev/docs/every | every}
   */
  async every(f: (a: A) => unknown): Promise<boolean> {
    return every(f, this.asyncIterable);
  }

  /**
   * Returns all elements in the given iterable into a string separated by separator.
   *
   * see {@link https://fxts.dev/docs/join | join}
   */
  async join(sep: string): Promise<string> {
    return join(sep, this.asyncIterable);
  }

  /**
   * Looks through each value in AsyncIterable, returning the first one that passes a truth test `f`,
   * or `undefined` if no value passes the test.
   *
   * see {@link https://fxts.dev/docs/find | find}
   */
  async find(f: (a: A) => unknown): Promise<A | undefined> {
    return find(f, this.asyncIterable);
  }

  /**
   * Returns the index of the first element of AsyncIterable which matches f, or -1 if no element matches.
   *
   * see {@link https://fxts.dev/docs/findIndex | findIndex}
   */
  async findIndex(f: (a: A) => unknown): Promise<number> {
    return findIndex(f, this.asyncIterable);
  }

  /**
   * Also known as foldl, this method boils down a list of values into a single value.
   *
   * see {@link https://fxts.dev/docs/reduce | reduce}
   */
  async reduce<B>(
    f: SyncReducer<Cast<A, B>, A>,
    seed?: B,
  ): Promise<Cast<A, B>> {
    return isUndefined(seed)
      ? reduce(f, this.asyncIterable)
      : reduce(f, seed as any, this.asyncIterable);
  }

  /**
   * Iterates over AsyncIterable, applying each in turn to `f`.
   *
   * see {@link https://fxts.dev/docs/each | each}
   */
  async each(f: (a: A) => unknown): Promise<void> {
    return each(f, this.asyncIterable);
  }

  /**
   * Takes item from AsyncIterable and returns an array.
   *
   * see {@link https://fxts.dev/docs/toArray | toArray}
   */
  async toArray(): Promise<Array<Awaited<A>>> {
    const array: Awaited<A>[] = [];
    for await (const a of this.asyncIterable) {
      array.push(a);
    }
    return array;
  }
}

export class FxIterable<A> {
  private iterable: Iterable<A>;

  constructor(iterable: Iterable<A>) {
    this.iterable = iterable;
  }

  private [Symbol.iterator]() {
    return this.iterable;
  }

  /**
   * Returns Iterable of values by running each applying `f`.
   *
   * see {@link https://fxts.dev/docs/map | map}
   */
  map<B>(f: (a: A) => B): FxIterable<B> {
    return new FxIterable(map(f, this.iterable));
  }

  /**
   * Returns flattened Iterable of values by running each element
   * flattening the mapped results.
   *
   * see {@link https://fxts.dev/docs/flatMap | flatMap}
   */
  flatMap<B>(f: (a: A) => B) {
    return new FxIterable(flatMap(f, this.iterable));
  }

  /**
   * Returns flattened Iterable.
   * If first argument is number, more perform flatten
   *
   * @example
   * `fx([[1],[[2]]]).flat(2).toArray(); // [1,2]`
   *
   * see {@link https://fxts.dev/docs/flat | flat}
   */
  flat<T extends number = 1>(depth?: T) {
    const res = flat(this.iterable, depth);

    return new FxIterable(res) as FxIterable<DeepFlat<A, T>>;
  }

  /**
   * Return Iterable of all elements `f` returns truthy for
   *
   * see {@link https://fxts.dev/docs/filter | filter}
   */
  filter(f: (a: A) => unknown): FxIterable<A> {
    return new FxIterable(filter(f, this.iterable));
  }

  /**
   * The opposite of filter method
   * Iterable of all elements `f` returns falsy for
   *
   * see {@link https://fxts.dev/docs/reject | reject}
   */
  reject(f: (a: A) => unknown): FxIterable<A> {
    return new FxIterable(reject(f, this.iterable));
  }

  /**
   * Returns Iterable that taken the first argument `l` values from iterable
   *
   * see {@link https://fxts.dev/docs/take | take}
   */
  take(n: number): FxIterable<A> {
    return new FxIterable(take(n, this.iterable));
  }

  /**
   * Returns Iterable that taken values until truthy when given `f` is applied.
   *
   * see {@link https://fxts.dev/docs/takeUntil | takeUntil}
   */
  takeUntil(f: (a: A) => unknown): FxIterable<A> {
    return new FxIterable(takeUntil(f, this.iterable));
  }

  /**
   * Returns Iterable that taken values as long as each value satisfies the give `f`.
   *
   * see {@link https://fxts.dev/docs/takeWhile | takeWhile}
   */
  takeWhile(f: (a: A) => unknown): FxIterable<A> {
    return new FxIterable(takeWhile(f, this.iterable));
  }

  /**
   * Iterate over an input list,
   * calling a provided `f` for each element in the Iterable.
   *
   * see {@link https://fxts.dev/docs/peek | peek}
   */
  peek(f: (a: A) => unknown): FxIterable<A> {
    return new FxIterable(peek(f, this.iterable));
  }

  /**
   * Returns all but the first `length` elements of the given iterable.
   *
   * see {@link https://fxts.dev/docs/drop | drop}
   */
  drop(length: number): FxIterable<A> {
    return new FxIterable(drop(length, this.iterable));
  }

  /**
   * Returns Iterable of the given elements from startIndex(inclusive) to endIndex(exclusive).
   *
   * see {@link https://fxts.dev/docs/slice | slice}
   */
  slice(start: number, end?: number): FxIterable<A> {
    return isUndefined(end)
      ? new FxIterable(slice(start, this.iterable))
      : new FxIterable(slice(start, end, this.iterable));
  }

  /**
   *
   * `chain` allows you to use functions that are not provided in method chaining.
   * The functions available for the `chain` argument return an asyncIterable.
   *
   * @example
   * ```
   * fx(range(1, 4))
   *   .chain(append(4))
   *   .chain(append(5))
   *   .toArray(); // [1, 2, 3, 4, 5]
   * ```
   */
  chain<B>(f: (iterable: Iterable<A>) => Iterable<B>): FxIterable<B> {
    return new FxIterable(f(this.iterable));
  }

  /**
   * Returns AsyncIterable, `toAsync` used when you want to handle Promise values inside Iterable.
   *
   * see {@link https://fxts.dev/docs/toAsync | toAsync}
   */
  toAsync(): FxAsyncIterable<A> {
    return new FxAsyncIterable(toAsync(this.iterable));
  }

  /**
   * Splits Iterable into sets, grouped by the result of running each value through `f`.
   *
   * see {@link https://fxts.dev/docs/groupBy | groupBy}
   */
  groupBy(f: (a: A) => Key) {
    return groupBy(f, this.iterable);
  }

  /**
   * Given `f` that generates a key,
   * turns a list of objects into an object indexing the objects by the given key.
   * Note that if multiple objects generate the same value for the indexing key only the last value will be included in the generated object.
   *
   * see {@link https://fxts.dev/docs/indexBy | indexBy}
   */
  indexBy(f: (a: A) => Key) {
    return indexBy(f, this.iterable);
  }

  /**
   * Returns true if any of the values in AsyncIterable pass `f` truth test
   *
   * see {@link https://fxts.dev/docs/some | some}
   */
  some(f: (a: A) => unknown): boolean {
    return some(f, this.iterable);
  }

  /**
   * Returns true if all of the values in AsyncIterable pass the `f` truth test.
   *
   * see {@link https://fxts.dev/docs/every | every}
   */
  every(f: (a: A) => unknown): boolean {
    return every(f, this.iterable);
  }

  /**
   * Returns all elements in the given iterable into a string separated by separator.
   *
   * see {@link https://fxts.dev/docs/join | join}
   */
  join(sep: string): string {
    return join(sep, this.iterable);
  }

  /**
   * Looks through each value in AsyncIterable, returning the first one that passes a truth test `f`,
   * or `undefined` if no value passes the test.
   *
   * see {@link https://fxts.dev/docs/find | find}
   */
  find(f: (a: A) => unknown): A | undefined {
    return find(f, this.iterable);
  }

  /**
   * Returns the index of the first element of AsyncIterable which matches f, or -1 if no element matches.
   *
   * see {@link https://fxts.dev/docs/findIndex | findIndex}
   */
  findIndex(f: (a: A) => unknown): number {
    return findIndex(f, this.iterable);
  }

  /**
   * Also known as foldl, this method boils down a list of values into a single value.
   *
   * see {@link https://fxts.dev/docs/reduce | reduce}
   */
  reduce<B>(f: SyncReducer<Cast<A, B>, A>, seed?: B): Cast<A, B> {
    return isUndefined(seed)
      ? reduce(f, this.iterable)
      : reduce(f, seed as any, this.iterable);
  }

  /**
   * Iterates over Iterable, applying each in turn to `f`.
   *
   * see {@link https://fxts.dev/docs/each | each}
   */
  each(f: (a: A) => unknown): void {
    return each(f, this.iterable);
  }

  /**
   * Takes item from Iterable and returns an array.
   *
   * see {@link https://fxts.dev/docs/toArray | toArray}
   */
  toArray(): Array<A> {
    return Array.from(this.iterable);
  }

  toIterator(): Array<A> {
    return Array.from(this.iterable);
  }
}

/**
 * `fx` allows functions provided by existing `fxts` to be used in a method chaining.
 *  Not all functions are provided as methods and can be connected through `chain` if necessary.
 *
 *  see {@link https://fxts.dev/docs/method-chaining | guide}
 *
 * @example
 * ```ts
 * const syncArr1 = fx([1, 2, 3, 4])
 *   .map((a) => a + 10)
 *   .toArray(); // [11, 12, 13, 14]
 *
 * // If you want to use another function that is not provided for the method, use `chain`.
 * const syncArr2 = fx([1, 2, 3, 4])
 *   .chain(append(5))
 *   .map((a) => a + 10)
 *   .toArray(); // [11, 12, 13, 14, 15]
 *
 * const asyncArr1 = await fx([1, 2, 3, 4])
 *   .toAsync()
 *   .map((a) => a + 10)
 *   .toArray(); // [11, 12, 13, 14]
 *
 * const asyncArr2 = await fx(toAsync([1, 2, 3, 4]))
 *   .map((a) => a + 10)
 *   .toArray(); // [11, 12, 13, 14]
 * ```
 */
function fx<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  a: T,
): T extends Iterable<unknown>
  ? FxIterable<IterableInfer<T>>
  : FxAsyncIterable<IterableInfer<T>> {
  if (isAsyncIterable(a)) {
    return new FxAsyncIterable(a) as any;
  } else if (isIterable(a)) {
    return new FxIterable(a) as any;
  }

  throw new TypeError(`'fx' must be type of Iterable or AsyncIterable`);
}

export default fx;
