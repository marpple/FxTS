import concurrent, { isConcurrent } from "./concurrent";
import last from "../last";
import IterableInfer from "../types/IterableInfer";
import ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";
import DeepFlat from "../types/DeepFlat";
import { empty, isAsyncIterable, isIterable } from "../_internal/utils";
import { Reject, Resolve } from "../types/Utils";
import append from "./append";
import concat from "./concat";

const isFlatAble = (a: unknown) => typeof a !== "string" && isIterable(a);

function sync<A>(iterable: Iterable<A>, depth: number): IterableIterator<A> {
  const iterator = iterable[Symbol.iterator]();
  const iteratorStack = [iterator];

  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      const iterator = last(iteratorStack);
      if (!iterator) {
        return { done: true, value: undefined };
      }

      const { value, done } = iterator.next();
      if (done) {
        iteratorStack.pop();
        return this.next();
      }

      if (isFlatAble(value) && iteratorStack.length < depth + 1) {
        iteratorStack.push(value[Symbol.iterator]());
        return this.next();
      }

      return {
        done: false,
        value,
      };
    },
  };
}

function asyncConcurrent<A>(
  iterable: AsyncIterable<A>,
  depth: number,
): AsyncIterableIterator<A> {
  const originIterator = iterable[Symbol.asyncIterator]();
  let prevItem = Promise.resolve();
  let flattenIterator = empty() as IterableIterator<A>;
  let finished = false;
  const settlementQueue: [Resolve<A>, Reject][] = [];

  const fillItem = async () => {
    const { done, value } = await originIterator.next();
    if (done) {
      return false;
    }

    if (isFlatAble(value)) {
      flattenIterator = concat(
        sync(value as Iterable<A>, depth - 1),
        flattenIterator,
      );
    } else {
      flattenIterator = append(value, flattenIterator);
    }
    return true;
  };

  const pullItem = async (): Promise<IteratorResult<A>> => {
    if (finished) {
      return { done: true, value: undefined };
    }

    const { value, done } = flattenIterator.next();
    if (done) {
      const hasItem = await fillItem();
      if (hasItem) {
        return pullItem();
      }

      return { done: true, value: undefined };
    }

    return { done: false, value };
  };

  const resolveItem = ({ done, value }: any) => {
    if (done || finished) {
      while (settlementQueue.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const [resolve] = settlementQueue.shift()!;
        resolve({ done: true, value: undefined });
      }
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [resolve] = settlementQueue.shift()!;
    resolve({ done, value });
  };

  const catchItem = (err: any) => {
    finished = true;
    // eslint-disable-next-line
    const [_, reject] = settlementQueue.shift()!;
    reject(err);
  };

  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next() {
      return new Promise((resolve, reject) => {
        settlementQueue.push([resolve, reject]);

        prevItem = prevItem
          .then(() => pullItem())
          .then(resolveItem)
          .catch(catchItem);
      });
    },
  };
}

function asyncSequential<A>(
  iterable: AsyncIterable<A>,
  depth: number,
): AsyncIterableIterator<A> {
  const iterator = iterable[Symbol.asyncIterator]();
  const iteratorStack = [iterator];
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next() {
      const iterator = last(iteratorStack);
      if (!iterator) {
        return { done: true, value: undefined };
      }

      const { value, done } = await iterator.next();
      if (done) {
        iteratorStack.pop();
        return this.next();
      }

      if (isFlatAble(value) && iteratorStack.length < depth + 1) {
        iteratorStack.push(value[Symbol.iterator]());
        return this.next();
      }

      return {
        done: false,
        value,
      };
    },
  };
}

function async<A>(
  iterable: AsyncIterable<A>,
  depth: number,
): AsyncIterableIterator<A> {
  let _iterator: AsyncIterator<A> | null = null;
  return {
    async next(_concurrent: any) {
      if (_iterator === null) {
        _iterator = isConcurrent(_concurrent)
          ? asyncConcurrent(concurrent(_concurrent.length, iterable), depth)
          : asyncSequential(iterable, depth);
      }
      return _iterator.next(_concurrent);
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

/**
 * Returns flattened Iterable/AsyncIterable.
 * If first argument is number, more perform flatten `flat(2, [[[1,2]]]) // [1,2]`
 *
 * @example
 * ```ts
 * const iter = flat([1,[2,3],[[4,5]]]);
 * iter.next() // {done:false, value: 1}
 * iter.next() // {done:false, value: 2}
 * iter.next() // {done:false, value: 3}
 * iter.next() // {done:false, value: [4, 5]}
 * iter.next() // {done:true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  [1,[2, 3],[[4, 5]]],
 *  flat,
 *  toArray,
 * ); // [1, 2, 3, [4, 5]]
 *
 * await pipe(
 *  Promise.resolve([1,[2, 3],[[4, 5]]]),
 *  flat,
 *  toArray,
 * ); // [1, 2, 3, [4, 5]]
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-flat-6t2in | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
// prettier-ignore
function flat<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B extends number = 1
>(
  iterator: A,
  depth?: B
): ReturnIterableIteratorType<A, DeepFlat<IterableInfer<A>, B>>;

function flat<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  iterable: Iterable<A> | AsyncIterable<A>,
  depth = 1,
) {
  if (isIterable(iterable)) {
    return sync(iterable, depth);
  }

  if (isAsyncIterable(iterable)) {
    return async(iterable, depth);
  }

  throw new TypeError("iterable must be type of Iterable or AsyncIterable");
}

export default flat;
