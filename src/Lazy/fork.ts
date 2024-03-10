import { isAsyncIterable, isIterable } from "../_internal/utils";
import { LinkedList } from "../dataStructure/linkedList/linkedList";
import type { LinkedListNode } from "../dataStructure/linkedList/linkedListNode";
import isNil from "../isNil";
import type IterableInfer from "../types/IterableInfer";

type ReturnForkType<A extends Iterable<unknown> | AsyncIterable<unknown>> =
  A extends AsyncIterable<any>
    ? AsyncIterableIterator<IterableInfer<A>>
    : IterableIterator<IterableInfer<A>>;

type Value = any;

type ForkItem = {
  queue: LinkedList<IteratorResult<Value>>;
  originNext: () => IteratorResult<Value, any>;
};

const forkMap = new WeakMap<Iterator<Value>, ForkItem>();

function sync<T>(iterable: Iterable<T>) {
  const iterator = iterable[Symbol.iterator]();

  const getNext = (forkItem: ForkItem) => {
    let current: LinkedListNode<IteratorResult<T>> | null =
      forkItem.queue.getLastNode();

    const done = () => {
      iterator.next = forkItem.originNext;

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
        const node = forkItem.originNext();

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
      originNext: originNext,
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
};

const forkAsyncMap = new WeakMap<AsyncIterator<Value>, ForkAsyncItem>();

function async<T>(iterable: AsyncIterable<T>) {
  const iterator = iterable[Symbol.asyncIterator]();

  const getNext = (forkItem: ForkAsyncItem) => {
    let current: Promise<LinkedListNode<IteratorResult<T>> | null> =
      Promise.resolve(forkItem.queue.getLastNode());

    const done = () => {
      iterator.next = forkItem.next;

      return {
        done: true,
        value: undefined,
      } as const;
    };

    let isDone = false;
    const next = async (_concurrent: any) => {
      if (isDone) {
        return done();
      }

      const itemCurrent = await current;
      const item = itemCurrent?.getNext();

      return new Promise((resolve, reject) => {
        if (isNil(item) || item === forkItem.queue.getTail()) {
          return forkItem
            .next(_concurrent)
            .then((node) => {
              current = current.then(() => {
                return forkItem.queue.insertLast(node);
              });

              isDone = node.done ?? true;
              if (isDone) {
                return resolve(done());
              }

              return resolve(node);
            })
            .catch(reject);
        }

        current = current.then(() => {
          return item;
        });

        resolve(item.getValue());
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
