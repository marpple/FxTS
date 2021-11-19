import { isAsyncIterable, isIterable } from "../_internal/utils";
import concurrent, { Concurrent, isConcurrent } from "./concurrent";
import pipe1 from "../pipe1";
import IterableInfer from "../types/IterableInfer";
import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import { Reject, Resolve } from "../types/Utils";
import { AsyncFunctionException } from "../_internal/error";

async function* asyncSequential<A>(
  f: (a: A) => unknown,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A> {
  for await (const item of iterable) {
    if (await f(item)) yield item;
  }
}

function asyncConcurrent<A>(
  iterable: AsyncIterable<[boolean, A]>,
): AsyncIterableIterator<A> {
  const iterator = iterable[Symbol.asyncIterator]();
  const settlementQueue: [Resolve<A>, Reject][] = [] as unknown as [
    Resolve<A>,
    Reject,
  ][];
  const buffer: A[] = [];
  let finished = false;
  let nextCallCount = 0;
  let resolvedCount = 0;
  let prevItem = Promise.resolve();

  function fillBuffer(concurrent: Concurrent) {
    const nextItem = iterator.next(concurrent as any);
    prevItem = prevItem
      .then(() => nextItem)
      .then(({ done, value }) => {
        if (done) {
          while (settlementQueue.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const [resolve] = settlementQueue.shift()!;
            resolve({ done: true, value: undefined });
          }
          return void (finished = true);
        }

        const [cond, item] = value;
        if (cond) {
          buffer.push(item);
        }
        recur(concurrent);
      })

      .catch((reason: any) => {
        finished = true;
        while (settlementQueue.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const [, reject] = settlementQueue.shift()!;
          reject(reason);
        }
      });
  }

  function consumeBuffer() {
    while (buffer.length > 0 && nextCallCount > resolvedCount) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const value = buffer.shift()!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [resolve] = settlementQueue.shift()!;
      resolve({ done: false, value });
      resolvedCount++;
    }
  }

  function recur(concurrent: Concurrent) {
    if (finished || nextCallCount === resolvedCount) {
      return;
    } else if (buffer.length > 0) {
      consumeBuffer();
    } else {
      fillBuffer(concurrent);
    }
  }

  return {
    async next(concurrent: any) {
      nextCallCount++;
      if (finished) {
        return { done: true, value: undefined };
      }
      return new Promise((resolve, reject) => {
        settlementQueue.push([resolve, reject]);
        recur(concurrent as Concurrent);
      });
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

function toFilterIterator<A>(
  f: (a: A) => unknown,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<[boolean, A]> {
  const iterator = iterable[Symbol.asyncIterator]();
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next() {
      const { done, value } = await iterator.next();
      if (done) {
        return {
          done: true,
          value: undefined,
        } as IteratorReturnResult<undefined>;
      }

      return pipe1(
        f(value),
        (cond) =>
          ({
            done,
            value: [Boolean(cond), value],
          } as IteratorYieldResult<[boolean, A]>),
      );
    },
  };
}

function async<A>(
  f: (a: A) => unknown,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A> {
  let _iterator: AsyncIterator<A>;
  return {
    async next(_concurrent: any) {
      if (_iterator === undefined) {
        _iterator = isConcurrent(_concurrent)
          ? asyncConcurrent(
              concurrent(_concurrent.length, toFilterIterator(f, iterable)),
            )
          : asyncSequential(f, iterable);
      }
      return _iterator.next(_concurrent);
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

function* sync<A>(f: (a: A) => unknown, iterable: Iterable<A>) {
  for (const a of iterable) {
    const res = f(a);

    if (res instanceof Promise) {
      throw new AsyncFunctionException();
    }

    if (res) {
      yield a;
    }
  }
}

/**
 * Return Iterable/AsyncIterable of all elements `f` returns truthy for
 *
 * @example
 * ```ts
 * const iter = filter((a)=> a % 2 === 0, [0, 1, 2, 3, 4, 5, 6]);
 * iter.next() // {done:false, value: 0}
 * iter.next() // {done:false, value: 2}
 * iter.next() // {done:false, value: 4}
 * iter.next() // {done:false, value: 6}
 * iter.next() // {done:true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  [0, 1, 2, 3, 4, 5, 6],
 *  filter(a => a % 2 === 0),
 *  toArray,
 * ); // [0, 2, 4, 6]
 *
 * await pipe(
 *  Promise.resolve([0, 1, 2, 3, 4, 5, 6]),
 *  filter(a => a % 2 === 0),
 *  toArray,
 * ); // [0, 2, 4, 6]
 *
 * // if you want to use asynchronous callback
 * await pipe(
 *  Promise.resolve([0, 1, 2, 3, 4, 5, 6]),
 *  toAsync,
 *  filter(async a => a % 2 === 0),
 *  toArray,
 * ); // [0, 2, 4, 6]
 *
 * // toAsync
 * await pipe(
 *  [Promise.resolve(0), Promise.resolve(1), Promise.resolve(2), Promise.resolve(3),
 *   Promise.resolve(4), Promise.resolve(5), Promise.resolve(6)],
 *  toAsync,
 *  filter(a => a % 2 === 0),
 *  toArray,
 * ); // [0, 2, 4, 6]
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-filter-2ibz2 | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
function filter<A, B = unknown>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): IterableIterator<A>;

function filter<A, B = unknown>(
  f: (a: A) => B,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A>;

function filter<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B = unknown,
>(
  f: (a: IterableInfer<A>) => B,
): (iterable: A) => ReturnIterableIteratorType<A, IterableInfer<A>>;

function filter<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B = unknown,
>(
  f: (a: IterableInfer<A>) => B,
  iterable?: A,
):
  | IterableIterator<IterableInfer<A>>
  | AsyncIterableIterator<IterableInfer<A>>
  | ((iterable: A) => ReturnIterableIteratorType<A, IterableInfer<A>>) {
  if (iterable === undefined) {
    return (iterable: A): ReturnIterableIteratorType<A, IterableInfer<A>> =>
      filter(f, iterable as any) as ReturnIterableIteratorType<
        A,
        IterableInfer<A>
      >;
  }

  if (isIterable(iterable)) {
    return sync(f, iterable as Iterable<IterableInfer<A>>);
  }

  if (isAsyncIterable(iterable)) {
    return async(f, iterable as AsyncIterable<IterableInfer<A>>);
  }

  throw new TypeError("iterable must be type of Iterable or AsyncIterable");
}

export default filter;
