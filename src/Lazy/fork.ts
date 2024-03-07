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

const forkMap = new WeakMap<
  Iterator<Value>,
  LinkedList<IteratorResult<Value>>
>();

function sync<T>(iterable: Iterable<T>) {
  const iterator = iterable[Symbol.iterator]();
  let queue = forkMap.get(iterator) as LinkedList<IteratorResult<T>>;
  if (!queue) {
    queue = new LinkedList();
    forkMap.set(iterator, queue);
  }

  let current: LinkedListNode<IteratorResult<T>> | null = queue.getTail();
  let done = false;

  return {
    [Symbol.iterator]() {
      return iterator;
    },

    next() {
      if (done) {
        return {
          done,
          value: undefined,
        };
      }

      const item = current?.getNext();
      if (isNil(item)) {
        const node = iterator.next();
        current = queue.insertLast(node);
        done = node.done ?? true;

        return node;
      }

      current = item;
      return current.getValue();
    },
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
    return sync(iterable) as ReturnForkType<A>;
  }

  if (isAsyncIterable(iterable)) {
    throw new TypeError("'fork' asyncIterable isn't supported not yet");
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default fork;
