import { isAsyncIterable, isIterable } from "../_internal/utils";
import isNil from "../isNil";
import type IterableInfer from "../types/IterableInfer";

type ReturnForkType<A extends Iterable<unknown> | AsyncIterable<unknown>> =
  A extends AsyncIterable<any>
    ? AsyncIterableIterator<IterableInfer<A>>
    : IterableIterator<IterableInfer<A>>;

type Node<T> = { value: T; done?: boolean };

class ForkItem<T> {
  node: Node<T>;
  nextNode: ForkItem<T> | null;

  constructor(node: Node<T>) {
    this.node = node;
    this.nextNode = null;
  }
}

class ForkQueue<T> {
  head: ForkItem<T>;

  current: ForkItem<T>;

  constructor() {
    this.head = new ForkItem(null as any);
    this.current = this.head;
  }

  toString() {
    const arr = [];
    let cur: ForkItem<T> | null = this.head.nextNode;
    while (cur) {
      arr.push(cur.node.value);
      cur = cur.nextNode;
    }

    return arr.join(", ");
  }
}

const forkMap = new WeakMap<any, ForkQueue<any>>();

function sync<T>(iterable: Iterable<T>) {
  const iterator = iterable[Symbol.iterator]();
  let queue = forkMap.get(iterator) as ForkQueue<any>;
  if (!queue) {
    queue = new ForkQueue();
    forkMap.set(iterator, queue);
  }

  let cur = queue.current;
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

      const item = cur.nextNode;
      if (isNil(item)) {
        const node = iterator.next();
        cur.nextNode = new ForkItem(node);
        cur = cur.nextNode;

        queue.current = cur;
        done = node.done ?? true;

        return cur.node;
      }

      cur = item;
      return cur.node;
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
