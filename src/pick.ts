import { isAsyncIterable, isIterable } from "./_internal/utils";
import toArray from "./toArray";
import type IterableInfer from "./types/IterableInfer";

function inner<T extends object>(obj: T, keys: Set<keyof T>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => keys.has(k as keyof T)),
  );
}

function sync<T extends object, U extends Iterable<keyof T>>(
  iterable: U,
  obj: T,
): Pick<T, IterableInfer<U>> {
  const keys = new Set(iterable);
  return inner(obj, keys) as Pick<T, IterableInfer<U>>;
}

async function async<T extends object, U extends AsyncIterable<keyof T>>(
  iterable: U,
  obj: T,
): Promise<Pick<T, IterableInfer<U>>> {
  const keys = new Set(await toArray(iterable));
  return inner(obj, keys) as Pick<T, IterableInfer<U>>;
}

/**
 * Returns a partial copy of an object containing given keys.
 *
 * @example
 * ```ts
 * const person = {
 *   name: "james",
 *   age: 40,
 *   numberOfKids: 2,
 *   team: "Software Development",
 *   preferredLanguage: "Rust",
 * };
 *
 * const dad = pick(["name", "age", "numberOfKids"], person);
 * // { name: "james", age: 40, numberOfKids: 2 }
 *
 * const developer = pick(["name", "team", "preferredLanguage"], person);
 * // { name: "james", team: "Software Development", preferredLanguage: "Rust" }
 *
 * // with pipe
 * pipe(
 *  person,
 *  pick(["name", "age", "numberOfKids"]),
 * );
 *
 * // if you want to use AsyncIterable as the list of property names
 * const anonymousDeveloper = await pick(toAsync(["preferredLanguage"] as const), person);
 * ```
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/omit | omit},
 */

function pick<T extends object, U extends readonly []>(
  iterable: U,
  obj: T,
): Record<string, never>;

function pick<T extends object, U extends Iterable<keyof T>>(
  iterable: U,
  obj: T,
): Pick<T, IterableInfer<U>>;

function pick<T extends object, U extends AsyncIterable<keyof T>>(
  iterable: U,
  obj: T,
): Promise<Pick<T, IterableInfer<U>>>;

function pick<T extends object, U extends Iterable<keyof T>>(
  iterable: U,
): (obj: T) => Pick<T, IterableInfer<U>>;

function pick<T extends object, U extends AsyncIterable<keyof T>>(
  iterable: U,
): (obj: T) => Promise<Pick<T, IterableInfer<U>>>;

function pick<
  T extends object,
  U extends AsyncIterable<keyof T> | Iterable<keyof T>,
>(
  iterable: U,
  obj?: T,
):
  | Promise<Pick<T, IterableInfer<U>>>
  | Pick<T, IterableInfer<U>>
  | ((
      obj: T,
    ) => Promise<Pick<T, IterableInfer<U>>> | Pick<T, IterableInfer<U>>) {
  if (obj === undefined) {
    return (obj: T) => pick(iterable as any, obj) as any;
  }
  if (isIterable(iterable)) {
    return sync(iterable, obj);
  } else if (isAsyncIterable(iterable)) {
    return async(iterable, obj);
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default pick;
