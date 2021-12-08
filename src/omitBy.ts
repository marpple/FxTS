import {
  AsyncEntryPredicate,
  ConditionalAsyncEntryPredicate,
  EntryPredicate,
} from "./types/EntryPredicate";
import toArray from "./toArray";
import reject from "./Lazy/reject";
import toAsync from "./Lazy/toAsync";
import pipe from "./pipe";
import { map, zip } from "./Lazy";

/**
 *
 * Returns a partial copy of an object containing only the keys that satisfy the supplied predicate.
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: "2", c: true };
 * omitBy(([key, value]) => key === "a" || value === true, obj); // { b: "2" }
 *
 * // asynchronous predicate
 * await omitBy(async ([key, value]) => key === "a" || value === true, obj); // { b: "2" }
 *
 * // Using with the `pipe` function
 * pipe(
 *   obj,
 *   omitBy(([key, value]) => key === "a" || value === true)
 * );
 *
 * await pipe(
 *   obj,
 *   omitBy(async ([key, value]) => key === "a" || value === true)
 * );
 * ```
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/omit | omit},
 */

function omitBy<T extends object, F extends AsyncEntryPredicate<T>>(
  f: F,
  obj: T,
): Promise<Partial<T>>;

function omitBy<T extends object, F extends AsyncEntryPredicate<T>>(
  f: F,
): (obj: T) => Promise<Partial<T>>;

function omitBy<T extends object, F extends EntryPredicate<T>>(
  f: F,
  obj: T,
): Partial<T>;

function omitBy<T extends object, F extends EntryPredicate<T>>(
  f: F,
): (obj: T) => Partial<T>;

function omitBy<T extends object, F extends ConditionalAsyncEntryPredicate<T>>(
  f: F,
  obj: T,
): Partial<T> | Promise<Partial<T>>;

function omitBy<T extends object, F extends ConditionalAsyncEntryPredicate<T>>(
  f: F,
): (obj: T) => Partial<T> | Promise<Partial<T>>;

function omitBy<T extends object, F extends ConditionalAsyncEntryPredicate<T>>(
  f: F,
  obj?: T,
):
  | Partial<T>
  | Promise<Partial<T>>
  | ((obj: T) => Partial<T>)
  | ((obj: T) => Promise<Partial<T>>)
  | ((obj: T) => Partial<T> | Promise<Partial<T>>) {
  if (obj === undefined) {
    return (obj: T) => omitBy(f, obj);
  }

  const entries = Object.entries(obj);
  const conditions = entries.map((entry) => f(entry as any));
  const isAsync = conditions.some((c) => c instanceof Promise);

  if (isAsync) {
    return pipe(
      entries,
      zip(toAsync(conditions)),
      reject(([cond]) => cond),
      map(([, entry]) => entry),
      toArray,
      Object.fromEntries,
    ) as Promise<Partial<T>>;
  } else {
    return pipe(
      entries,
      zip(conditions),
      reject(([cond]) => cond),
      map(([, entry]) => entry),
      Object.fromEntries,
    ) as Partial<T>;
  }
}

export default omitBy;
