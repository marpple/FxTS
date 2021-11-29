import { AsyncFunctionException } from "../_internal/error";
import { isAsyncIterable, isIterable } from "../_internal/utils";

function* sync<A, B>(f: (a: A) => B, iterable: Iterable<A>) {
  const iterator = iterable[Symbol.iterator]();
  const iterableIterator = {
    [Symbol.iterator]() {
      return iterator;
    },
  };

  for (const a of iterableIterator) {
    const res = f(a);
    if (res instanceof Promise) {
      throw new AsyncFunctionException();
    }

    if (!res) {
      continue;
    } else {
      break;
    }
  }

  yield* iterableIterator;
}

async function* async<A, B>(f: (a: A) => B, iterable: AsyncIterable<A>) {
  const iterator = iterable[Symbol.asyncIterator]();
  const iterableIterator = {
    [Symbol.asyncIterator]() {
      return iterator;
    },
  };

  for await (const a of iterableIterator) {
    if (!(await f(a))) {
      continue;
    } else {
      break;
    }
  }

  yield* iterableIterator;
}

function dropUntil<A, B = unknown>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): IterableIterator<A>;

function dropUntil<A, B = unknown>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A>;

function dropUntil<A, B>(
  f: (a: A) => B,
  iterable: Iterable<A> | AsyncIterable<A>,
): IterableIterator<A> | AsyncIterableIterator<A> {
  if (isIterable(iterable)) {
    return sync(f, iterable);
  }

  if (isAsyncIterable(iterable)) {
    return async(f, iterable);
  }

  throw new TypeError("iterable must be type of Iterable or AsyncIterable");
}

export default dropUntil;
