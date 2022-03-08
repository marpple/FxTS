import pipe1 from "../pipe1";
import Arrow from "../types/Arrow";
import Awaited from "../types/Awaited";
import IterableInfer from "../types/IterableInfer";
import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import { empty, isAsyncIterable, isIterable } from "../_internal/utils";
import concurrent, { isConcurrent } from "./concurrent";
import head from "../head";

function* sync<A, B>(
  f: (a: B, b: A) => B,
  acc: B,
  iterable: Iterable<A>,
): IterableIterator<B> {
  yield acc;
  for (const a of iterable) {
    yield (acc = f(acc, a));
  }
}

async function* asyncSequential<A, B>(
  f: (a: B, b: A) => B,
  acc: Promise<B>,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<B> {
  yield acc;
  for await (const a of iterable) {
    yield (acc = pipe1(acc, (acc) => f(acc as B, a)));
  }
}

function async<A, B>(
  f: (a: B, b: A) => B,
  acc: Promise<B>,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<B> {
  let _iterator: AsyncIterator<B>;
  return {
    async next(_concurrent: any) {
      if (_iterator === undefined) {
        _iterator = isConcurrent(_concurrent)
          ? asyncSequential(f, acc, concurrent(_concurrent.length, iterable))
          : asyncSequential(f, acc, iterable);
      }
      return _iterator.next(_concurrent);
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

function asyncWithoutSeed<A, B>(
  f: (a: B, b: A) => B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<B> {
  let _iterator: AsyncIterator<B>;
  return {
    async next(_concurrent: any) {
      if (_iterator === undefined) {
        if (isConcurrent(_concurrent)) {
          const _iterable = concurrent(_concurrent.length, iterable);
          _iterator = asyncSequential(f, head(_iterable) as any, _iterable);
        } else {
          _iterator = asyncSequential(f, head(iterable) as any, iterable);
        }
      }
      return _iterator.next(_concurrent);
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

/**
 * Returns a Iterable/AsyncIterable of successively reduced values from the left.
 * It's similar to reduce
 *
 * @example
 * ```ts
 * const iter = scan((acc, cur) => acc * cur, 1, [1, 2, 3, 4 ]);
 * iter.next(); // {value: 1, done:false}
 * iter.next(); // {value: 1, done:false}
 * iter.next(); // {value: 2, done:false}
 * iter.next(); // {value: 6, done:false}
 * iter.next(); // {value: 24, done:false}
 * iter.next(); // {value: undefined, done: true}
 *
 * // with pipe
 * pipe(
 *   [1, 2, 3, 4],
 *   scan((acc, cur) => acc * cur),
 *   toArray,
 * ); // [1, 2, 6, 24]
 * ```
 */
function scan<A extends readonly []>(
  f: Arrow,
  iterable: A,
): IterableIterator<never>;

function scan<A extends readonly [], B>(
  f: Arrow,
  seed: B,
  iterable: A,
): IterableIterator<B>;

function scan<A>(
  f: (a: A, b: A) => A,
  iterable: Iterable<A>,
): IterableIterator<A>;

function scan<A, B>(
  f: (a: B, b: A) => B,
  seed: B,
  iterable: Iterable<A>,
): IterableIterator<B>;

function scan<A, B>(
  f: (a: B, b: A) => B,
  iterable: Iterable<A>,
): IterableIterator<B>;

function scan<A>(
  f: (a: A, b: A) => A | Promise<A>,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A>;

function scan<A, B>(
  f: (a: Awaited<B>, b: A) => B | Promise<B>,
  seed: B | Promise<B>,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<B>;

function scan<A, B>(
  f: (a: Awaited<B>, b: A) => B | Promise<B>,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<Awaited<B>>;

function scan<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  f: (
    a: IterableInfer<A>,
    b: IterableInfer<A>,
  ) => IterableInfer<A> | Promise<IterableInfer<A>>,
): (iterable: A) => ReturnIterableIteratorType<A, IterableInfer<A>>;

function scan<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: B, b: IterableInfer<A>) => B | Promise<B>,
): (iterable: A) => ReturnIterableIteratorType<A, B>;

function scan<A extends Iterable<unknown> | AsyncIterable<unknown>, B>(
  f: (a: B, b: IterableInfer<A>) => B,
  seed?: B | Iterable<IterableInfer<A>> | AsyncIterable<IterableInfer<A>>,
  iterable?: Iterable<IterableInfer<A>> | AsyncIterable<IterableInfer<A>>,
):
  | IterableIterator<B>
  | AsyncIterableIterator<B>
  | ((iterable: A) => ReturnIterableIteratorType<A, B>) {
  if (iterable === undefined) {
    if (seed === undefined) {
      return (iterable: A) => {
        return scan(
          f,
          iterable as any,
        ) as unknown as ReturnIterableIteratorType<A, B>;
      };
    }

    if (isIterable(seed)) {
      const iterator = seed[Symbol.iterator]();
      const { done, value } = iterator.next();
      if (done) {
        return empty() as IterableIterator<B>;
      }

      return sync(f, value as B, {
        [Symbol.iterator]() {
          return iterator;
        },
      });
    }

    if (isAsyncIterable(seed)) {
      return asyncWithoutSeed(f, seed);
    }

    throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
  }

  if (isIterable(iterable)) {
    return sync(f, seed as B, iterable);
  }

  if (isAsyncIterable(iterable)) {
    return async(f, Promise.resolve(seed as B), iterable);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default scan;
