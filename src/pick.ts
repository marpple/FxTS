import IterableInfer from "./types/IterableInfer";
import { isAsyncIterable, isIterable } from "./_internal/utils";
import toArray from "./toArray";

function sync<T extends object, U extends Iterable<keyof T>>(
  iterable: U,
  obj: T,
): Pick<T, IterableInfer<U>> {
  const keys = Array.isArray(iterable) ? iterable : Array.from(iterable);
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => keys.includes(k as keyof T)),
  ) as Pick<T, IterableInfer<U>>;
}

async function async<T extends object, U extends AsyncIterable<keyof T>>(
  iterable: U,
  obj: T,
): Promise<Pick<T, IterableInfer<U>>> {
  const keys = await toArray(iterable);
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => keys.includes(k as keyof T)),
  ) as any;
}

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
  if (isAsyncIterable(iterable)) {
    return async(iterable, obj);
  } else if (isIterable(iterable)) {
    return sync(iterable, obj);
  }
  throw new TypeError("`iterable` must be type of Iterable or AsyncIterable");
}

export default pick;
