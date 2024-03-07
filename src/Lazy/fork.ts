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
