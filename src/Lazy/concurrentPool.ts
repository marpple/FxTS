import { isAsyncIterable } from "../_internal/utils";
import type { Reject, Resolve } from "../types/Utils";

type Item<T> = {
  fail?: unknown;
  success:
    | { value: undefined; done: true } // done
    | { value: T; done: false };
};

/**
 * @experimental concurrentPool
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

  /**
   * @TODO ppeeou: Considering id circulation
   */
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
    try {
      const item = {
        success: await iterator.next(),
      } as Item<A>;
      idleWorkers++;

      itemMap.set(id, item);
      await chainItem(item);
    } catch (error) {
      idleWorkers++;
      finished = true;

      const item = {
        success: { done: false },
        fail: error,
      } as Item<A>;

      itemMap.set(id, item);
      await chainItem(item);
    }
  }

  async function chainItem(item: Item<A>) {
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
    const id = consumer.at(0)?.[2];
    if (id != null && itemMap.has(id)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [resolve, reject, id] = consumer.shift()!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const value = itemMap.get(id)!;
      itemMap.delete(id);
      value.fail ? reject(value.fail) : resolve(value.success);

      return;
    }

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
        const task: [Resolve<A>, Reject, number] = [resolve, reject, id];

        consumer.push(task);
        slide();
      });
    },
  } as AsyncIterableIterator<A>;
}

export default concurrentPool;
