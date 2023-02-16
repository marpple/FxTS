import { isAsyncIterable, isIterable } from "./_internal/utils";
import toArray from "./toArray";
import type IterableInfer from "./types/IterableInfer";

function inner<T extends object>(obj: T, keys: Set<keyof T>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !keys.has(k as keyof T)),
  );
}

function sync<T extends object, U extends Iterable<keyof T>>(
  iterable: U,
  obj: T,
): Omit<T, IterableInfer<U>> {
  const keys = new Set(iterable);
  return inner(obj, keys) as Omit<T, IterableInfer<U>>;
}

async function async<T extends object, U extends AsyncIterable<keyof T>>(
  iterable: U,
  obj: T,
): Promise<Omit<T, IterableInfer<U>>> {
  const keys = new Set(await toArray(iterable));
  return inner(obj, keys) as Omit<T, IterableInfer<U>>;
}

/**
 * Returns a partial copy of an object omitting the keys specified.
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
 * const dad = omit(["team", "preferredLanguage"], person);
 * // { name: "james", age: 40, numberOfKids: 2 }
 *
 * const developer = omit(["age", "numberOfKids"], person);
 * // { name: "james", team: "Software Development", preferredLanguage: "Rust" }
 *
 * // with pipe
 * pipe(
 *  person,
 *  omit(["team", "preferredLanguage"]),
 * );
 *
 * // if you want to use AsyncIterable as the list of property names
 * const anonymous = await omit(toAsync(["name"] as const), person);
 * ```
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/pick | pick},
 */

function omit<T extends object, U extends Iterable<keyof T>>(
  iterable: U,
  obj: T,
): Omit<T, IterableInfer<U>>;

function omit<T extends object, U extends AsyncIterable<keyof T>>(
  iterable: U,
  obj: T,
): Promise<Omit<T, IterableInfer<U>>>;

function omit<T extends object, U extends Iterable<keyof T>>(
  iterable: U,
): (obj: T) => Omit<T, IterableInfer<U>>;

function omit<T extends object, U extends AsyncIterable<keyof T>>(
  iterable: U,
): (obj: T) => Promise<Omit<T, IterableInfer<U>>>;

function omit<
  T extends object,
  U extends AsyncIterable<keyof T> | Iterable<keyof T>,
>(
  iterable: U,
  obj?: T,
):
  | Promise<Omit<T, IterableInfer<U>>>
  | Omit<T, IterableInfer<U>>
  | ((
      obj: T,
    ) => Promise<Omit<T, IterableInfer<U>>> | Omit<T, IterableInfer<U>>) {
  if (obj === undefined) {
    return (obj: T) => omit(iterable as any, obj) as any;
  }
  if (isIterable(iterable)) {
    return sync(iterable, obj) as Omit<T, IterableInfer<U>>;
  } else if (isAsyncIterable(iterable)) {
    return async(iterable, obj) as Promise<Omit<T, IterableInfer<U>>>;
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default omit;
