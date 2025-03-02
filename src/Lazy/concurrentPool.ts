import { isAsyncIterable } from "../_internal/utils";
import identity from "../identity";
import type { Reject, Resolve } from "../types/Utils";
import map from "./map";

type Item<T> = {
  fail?: unknown;
  success:
    | { value: undefined; done: true } // done
    | { value: T; done: false };
};

/**
 * Ensures consistency in the level of concurrency based on the given number of concurrent tasks.
 *
 * @example
 * ```ts
 * await pipe(
 *   [1, 2, 3, 4, 5, 6],
 *   toAsync,
 *   map((a) => delay(100 * a, a)),
 *   concurrentPool(3),
 *   each(console.log), // log 1, 2, 3, 4, 5, 6
 * ); // 2 seconds
 */
function concurrentPool<A>(
  length: number,
  iterable: AsyncIterable<A>,
): AsyncIterableIterator<A>;

function concurrentPool<A>(
  length: number,
  iterable?: AsyncIterable<A>,
): (iterable: AsyncIterable<A>) => AsyncIterableIterator<A>;

function concurrentPool<A>(
  length: number,
  iterable?: AsyncIterable<A>,
):
  | AsyncIterableIterator<A>
  | ((iterable: AsyncIterable<A>) => AsyncIterableIterator<A>) {
  if (iterable === undefined) {
    return (iterable) => {
      return concurrentPool(length, iterable);
    };
  }

  if (!Number.isFinite(length) || length <= 0) {
    throw new RangeError("'length' must be positive integer");
  }
  if (!isAsyncIterable(iterable)) {
    throw new TypeError("'iterable' must be type of AsyncIterable");
  }

  if (length === 1) {
    return map(identity, iterable);
  }

  let fillId = 1;
  let consumeId = 1;
  let idleWorkers = length;

  const consumer: [Resolve<A>, Reject, number][] = [];
  const itemMap: Map<number, Item<A>> = new Map();
  const iterator = iterable[Symbol.asyncIterator]();

  let finished = false;
  let prev = Promise.resolve();

  async function fetchNextItem() {
    if (idleWorkers <= 0) {
      return;
    }

    idleWorkers--;
    const id = fillId++;
    fillId = fillId % Number.MAX_SAFE_INTEGER;
    try {
      const item = {
        success: await iterator.next(),
      } as Item<A>;
      idleWorkers++;

      itemMap.set(id, item);
      chainItem(item);
    } catch (error) {
      idleWorkers++;
      finished = true;

      const item = {
        success: { done: false },
        fail: error,
      } as Item<A>;

      itemMap.set(id, item);
      chainItem(item);
    }
  }

  function chainItem(item: Item<A>) {
    prev = prev.then(() => item).then(pullItem);
    return item;
  }

  function doneQueue() {
    while (consumer.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [resolve] = consumer.shift()!;
      resolve({
        value: undefined,
        done: true,
      });
    }
  }

  async function pullItem(item: Item<A>): Promise<void> {
    while (consumer.length > 0) {
      const id = consumer[0][2];
      if (!itemMap.has(id)) {
        break;
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [resolve, reject] = consumer.shift()!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const value = itemMap.get(id)!;
      itemMap.delete(id);
      if (value.fail) {
        reject(value.fail);
        doneQueue();
      } else {
        resolve(value.success);
      }
    }

    /**
     * @TODO ppeeou: If an error occurs, the next iterator should not be executed
     */
    if (!item.success.done && consumer.length > 0) {
      fetchNextItem();
    }
  }

  async function processQueue() {
    if (idleWorkers == 0) {
      return;
    }

    return Promise.all(
      Array.from({ length: idleWorkers }, () => fetchNextItem()),
    );
  }

  function slide() {
    if (finished && fillId === consumeId) {
      while (consumer.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const [resolve] = consumer.shift()!;
        resolve({ value: undefined, done: true });
      }
    } else {
      processQueue();
    }
  }

  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next() {
      return new Promise((resolve, reject) => {
        const id = consumeId++;
        consumeId = consumeId % Number.MAX_SAFE_INTEGER;
        const task: [Resolve<A>, Reject, number] = [resolve, reject, id];

        consumer.push(task);
        slide();
      });
    },
  } as AsyncIterableIterator<A>;
}

export default concurrentPool;
