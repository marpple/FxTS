import { isPromise } from "./_internal/utils";
import filter from "./Lazy/filter";
import map from "./Lazy/map";
import toAsync from "./Lazy/toAsync";
import zip from "./Lazy/zip";
import pipe from "./pipe";
import toArray from "./toArray";
import type {
  AsyncEntryPredicate,
  ConditionalAsyncEntryPredicate,
  EntryPredicate,
} from "./types/EntryPredicate";

/**
 *
 * Returns a partial copy of an object which contains only the keys that satisfy the supplied predicate.
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
 * ```
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/pick | pick},
 */

function pickBy<T extends object, F extends AsyncEntryPredicate<T>>(
  f: F,
  obj: T,
): Promise<Partial<T>>;

function pickBy<T extends object, F extends AsyncEntryPredicate<T>>(
  f: F,
): (obj: T) => Promise<Partial<T>>;

function pickBy<T extends object, F extends EntryPredicate<T>>(
  f: F,
  obj: T,
): Partial<T>;

function pickBy<T extends object, F extends EntryPredicate<T>>(
  f: F,
): (obj: T) => Partial<T>;

function pickBy<T extends object, F extends ConditionalAsyncEntryPredicate<T>>(
  f: F,
  obj: T,
): Partial<T> | Promise<Partial<T>>;

function pickBy<T extends object, F extends ConditionalAsyncEntryPredicate<T>>(
  f: F,
): (obj: T) => Partial<T> | Promise<Partial<T>>;

function pickBy<T extends object, F extends ConditionalAsyncEntryPredicate<T>>(
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
  const isAsync = conditions.some((c) => isPromise(c));

  if (isAsync) {
    return pipe(
      entries,
      zip(toAsync(conditions)),
      filter(([cond]) => cond),
      map(([, entry]) => entry),
      toArray,
      Object.fromEntries,
    ) as Promise<Partial<T>>;
  } else {
    return pipe(
      entries,
      zip(conditions),
      filter(([cond]) => cond),
      map(([, entry]) => entry),
      Object.fromEntries,
    ) as Partial<T>;
  }
}

export default pickBy;
