import IterableInfer from "./types/IterableInfer";
import { isAsyncIterable, isIterable } from "./_internal/utils";
import toArray from "./toArray";

function inner<T>(obj: T, keys: Set<keyof T>) {
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
  if (isAsyncIterable(iterable)) {
    return async(iterable, obj) as Promise<Omit<T, IterableInfer<U>>>;
  } else if (isIterable(iterable)) {
    return sync(iterable, obj) as Omit<T, IterableInfer<U>>;
  }
  throw new TypeError("`iterable` must be type of Iterable or AsyncIterable");
}

export default omit;
