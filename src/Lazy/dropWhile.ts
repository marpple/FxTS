import IterableInfer from "../types/IterableInfer";
import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import { AsyncFunctionException } from "../_internal/error";
import { isAsyncIterable, isIterable } from "../_internal/utils";

function* sync<A, B>(f: (a: A) => B, iterable: Iterable<A>) {
  for (const a of iterable) {
    const res = f(a);
    if (res instanceof Promise) {
      throw new AsyncFunctionException();
    }

    if (res) {
      continue;
    }
    yield a;
  }
}

async function* async<A, B>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A> {
  for await (const a of iterable) {
    if (await f(a)) {
      continue;
    }

    yield a;
  }
}

function dropWhile<A, B = unknown>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): IterableIterator<A>;

function dropWhile<A, B = unknown>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A>;

function dropWhile<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: IterableInfer<A>) => B,
): (iterable: A) => ReturnIterableIteratorType<A>;

function dropWhile<A extends Iterable<unknown>, B>(
  f: (a: IterableInfer<A>) => B,
  iterable?: A,
):
  | IterableIterator<IterableInfer<A>>
  | AsyncIterableIterator<IterableInfer<A>>
  | ((iterable: A) => ReturnIterableIteratorType<A>) {
  if (iterable === undefined) {
    return (iterable: A) => {
      return dropWhile(f, iterable as any) as ReturnIterableIteratorType<A>;
    };
  }

  if (isIterable(iterable)) {
    return sync(f, iterable as Iterable<IterableInfer<A>>);
  }

  if (isAsyncIterable(iterable)) {
    return async(f, iterable as AsyncIterable<IterableInfer<A>>);
  }

  throw new TypeError("iterable must be type of Iterable or AsyncIterable");
}

export default dropWhile;
