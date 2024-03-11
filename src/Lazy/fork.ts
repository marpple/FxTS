import { isAsyncIterable, isIterable } from "../_internal/utils";
import { LinkedList } from "../dataStructure/linkedList/linkedList";
import type { LinkedListNode } from "../dataStructure/linkedList/linkedListNode";
import isNil from "../isNil";
import type IterableInfer from "../types/IterableInfer";
import type { Reject, Resolve } from "../types/Utils";
import type { Concurrent } from "./concurrent";

type ReturnForkType<A extends Iterable<unknown> | AsyncIterable<unknown>> =
  A extends AsyncIterable<any>
    ? AsyncIterableIterator<IterableInfer<A>>
    : IterableIterator<IterableInfer<A>>;

type Value = any;

type ForkItem = {
  queue: LinkedList<IteratorResult<Value>>;
  next: () => IteratorResult<Value, any>;
};

const forkMap = new WeakMap<Iterator<Value>, ForkItem>();

function sync<T>(iterable: Iterable<T>) {
  const iterator = iterable[Symbol.iterator]();

  const getNext = (forkItem: ForkItem) => {
    let current: LinkedListNode<IteratorResult<T>> | null =
      forkItem.queue.getLastNode();

    const done = () => {
      iterator.next = forkItem.next;

      return {
        done: true,
        value: undefined,
      } as const;
    };

    let isDone = false;
    const next = () => {
      if (isDone) {
        return done();
      }

      const item = current?.getNext();

      if (isNil(item) || item === forkItem.queue.getTail()) {
        const node = forkItem.next();

        current = forkItem.queue.insertLast(node);
        isDone = node.done ?? true;
        if (isDone) {
          return done();
        }

        return node;
      }

      current = item;
      return current.getValue();
    };

    return next;
  };

  let forkItem = forkMap.get(iterator) as ForkItem;

  if (!forkItem) {
    const originNext = iterator.next.bind(iterator);
    forkItem = {
      queue: new LinkedList(),
      next: originNext,
    };

    iterator.next = getNext(forkItem);
    forkMap.set(iterator, forkItem);
  }

  const next = getNext(forkItem);

  return {
    [Symbol.iterator]() {
      return this;
    },

    next: next,
  };
}

type ForkAsyncItem = {
  queue: LinkedList<IteratorResult<Value>>;
  next: (...args: any) => Promise<IteratorResult<Value, any>>;
  done: boolean;
};

const forkAsyncMap = new WeakMap<AsyncIterator<Value>, ForkAsyncItem>();

function async<T>(iterable: AsyncIterable<T>) {
  const iterator = iterable[Symbol.asyncIterator]();

  const getNext = (forkItem: ForkAsyncItem) => {
    const settlementQueue: [Resolve<T>, Reject][] = [];
    let currentNode: LinkedListNode<IteratorResult<T>> | null =
      forkItem.queue.getLastNode() ?? null;
    let nextCallCount = 0;
    let resolvedCount = 0;
    let prevItem = Promise.resolve();

    const fillBuffer = (concurrent: Concurrent) => {
      const nextItem = forkItem.next(concurrent);

      prevItem = prevItem
        .then(() => nextItem)
        .then(({ done, value }) => {
          if (done) {
            while (settlementQueue.length > 0) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const [resolve] = settlementQueue.shift()!;
              resolve({ done: true, value: undefined });
            }

            return void (forkItem.done = true);
          }

          forkItem.queue.insertLast({ done: false, value });
          recur(concurrent);
        })
        .catch((reason) => {
          forkItem.done = true;
          while (settlementQueue.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const [, reject] = settlementQueue.shift()!;
            reject(reason);
          }
        });
    };

    function consumeBuffer() {
      while (
        forkItem.queue.hasNext(currentNode) &&
        nextCallCount > resolvedCount
      ) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const result = currentNode.getNext()!.getValue()!;
        currentNode = currentNode.getNext();

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const [resolve] = settlementQueue.shift()!;
        resolve(result);
        resolvedCount++;
      }
    }

    function recur(concurrent: Concurrent) {
      if (nextCallCount === resolvedCount) {
        return;
      } else if (forkItem.queue.hasNext(currentNode)) {
        consumeBuffer();
      } else {
        fillBuffer(concurrent);
      }
    }

    const next = async (concurrent: Concurrent) => {
      if (forkItem.done && !forkItem.queue.hasNext(currentNode)) {
        return { done: true, value: undefined };
      }

      nextCallCount++;
      return new Promise((resolve, reject) => {
        settlementQueue.push([resolve, reject]);
        recur(concurrent);
      });
    };

    return next;
  };

  let forkItem = forkAsyncMap.get(iterator) as ForkAsyncItem;
  if (!forkItem) {
    const originNext = iterator.next.bind(iterator);
    forkItem = {
      queue: new LinkedList(),
      next: originNext,
      done: false,
    };

    iterator.next = getNext(forkItem) as any;
    forkAsyncMap.set(iterator, forkItem);
  }

  const next = getNext(forkItem);
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    next: next,
  };
}

/**
 * Returns an iterable of forks of original source. Each fork contains the same values as source, and can be consumed independently.
 *
 * @example
 * ```ts
 * const arr = [1, 2, 3];
 * const iter1 = fork(arr);
 * const iter2 = fork(arr);
 *
 * iter1.next() // {done:false, value: 1}
 * iter1.next() // {done:false, value: 2}
 * iter2.next() // {done:false, value: 1}
 * iter2.next() // {done:false, value: 2}
 *
 * const str = 'abc'
 * const strIter1 = fork(str);
 * const strIter2 = fork(str);
 *
 * strIter1.next() // {done:false, value: 'a'}
 * strIter1.next() // {done:false, value: 'b'}
 * strIter2.next() // {done:false, value: 'a'}
 * strIter2.next() // {done:false, value: 'b'}
 *
 * // with pipe
 * const arrAdd10 = pipe(
 *   [1, 2, 3],
 *   map((a) => a + 10),
 * );
 *
 * const arrAdd10Iter1 = fork(arrAdd10);
 * const arrAdd10Iter2 = fork(arrAdd10);
 * arrAdd10Iter1.next() // { value: 11, done: false }
 * arrAdd10Iter2.next() // { value: 11, done: false }
 *
 * const arrAdd10Iter3 = fork(arrAdd10Iter1);
 * arrAdd10Iter1.next() // { value: 12, done: false }
 * arrAdd10Iter1.next() // { value: 13, done: false }
 * arrAdd10Iter2.next() // { value: 12, done: false }
 * arrAdd10Iter3.next() // { value: 12, done: false }
 * ```
 */
// prettier-ignore
function fork<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  iterable: A,
): ReturnForkType<A> {
  if (isIterable(iterable)) {
    return sync(iterable) as any;
  }

  if (isAsyncIterable(iterable)) {
    return async(iterable) as any;
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default fork;
