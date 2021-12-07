import toArray from "./toArray";
import filter from "./Lazy/filter";
import toAsync from "./Lazy/toAsync";
import pipe from "./pipe";
import { map, zip } from "./Lazy";

type AsyncEntryFunction<T extends object> = ([key, value]: [
  keyof T,
  T[keyof T],
]) => Promise<boolean>;

type EntryFunction<T extends object> = ([key, value]: [
  keyof T,
  T[keyof T],
]) => boolean;

type ConditionalAsyncEntryFunction<T extends object> = ([key, value]: [
  keyof T,
  T[keyof T],
]) => boolean | Promise<boolean>;

/**
 * pickBy
 *
 * Returns a partial copy of an object containing only the keys that satisfy the supplied predicate.
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: "2", c: true };
 * pickBy(([key, value]) => key === "a" || value === true, obj); // { a: 1, c: true }
 *
 * // asynchronous predicate
 * await pickBy(async ([key, value]) => key === "a" || value === true, obj); // { a: 1, c: true }
 *
 * // Using with the `pipe` function
 * pipe(
 *   obj,
 *   pickBy(([key, value]) => key === "a" || value === true)
 * );
 *
 * await pipe(
 *   obj,
 *   pickBy(async ([key, value]) => key === "a" || value === true)
 * );
 *
 * ```
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/pick | pick},
 */

function pickBy<T extends object, F extends AsyncEntryFunction<T>>(
  f: F,
  obj: T,
): Promise<Partial<T>>;

function pickBy<T extends object, F extends AsyncEntryFunction<T>>(
  f: F,
): (obj: T) => Promise<Partial<T>>;

function pickBy<T extends object, F extends EntryFunction<T>>(
  f: F,
  obj: T,
): Partial<T>;

function pickBy<T extends object, F extends EntryFunction<T>>(
  f: F,
): (obj: T) => Partial<T>;

function pickBy<T extends object, F extends ConditionalAsyncEntryFunction<T>>(
  f: F,
  obj: T,
): Partial<T> | Promise<Partial<T>>;

function pickBy<T extends object, F extends ConditionalAsyncEntryFunction<T>>(
  f: F,
): (obj: T) => Partial<T> | Promise<Partial<T>>;

function pickBy<T extends object, F extends ConditionalAsyncEntryFunction<T>>(
  f: F,
  obj?: T,
):
  | Partial<T>
  | Promise<Partial<T>>
  | ((obj: T) => Partial<T>)
  | ((obj: T) => Promise<Partial<T>>)
  | ((obj: T) => Partial<T> | Promise<Partial<T>>) {
  if (obj === undefined) {
    return (obj: T) => pickBy(f, obj);
  }

  const entries = Object.entries(obj);
  const conditions = entries.map((entry) => f(entry as any));
  const isAsync = conditions.some((c) => c instanceof Promise);

  if (isAsync) {
    return pipe(
      entries,
      zip(toAsync(conditions)),
      filter(([cond]) => cond),
      map(([_cond, entry]) => entry),
      toArray,
      Object.fromEntries,
    ) as Promise<Partial<T>>;
  } else {
    return pipe(
      entries,
      zip(conditions),
      filter(([cond]) => cond),
      map(([_cond, entry]) => entry),
      Object.fromEntries,
    ) as Partial<T>;
  }
}

export default pickBy;
