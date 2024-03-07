import { LinkedListNode } from "./linkedListNode";

export class LinkedList<T> {
  private head: LinkedListNode<T>;
  private tail: LinkedListNode<T>;

  constructor() {
    this.head = new LinkedListNode(null as unknown as T);
    this.tail = this.head;
  }

  insertFirst(value: T): LinkedListNode<T> {
    const node = new LinkedListNode(value);
    if (this.isEmpty()) {
      this.tail = node;
      this.head.setNextNode(node);
    } else {
      node.setNextNode(this.head.getNext());
      this.head.setNextNode(node);
    }

    return node;
  }

  insertLast(value: T): LinkedListNode<T> {
    if (this.isEmpty()) {
      return this.insertFirst(value);
    }

    const node = new LinkedListNode(value);
    this.tail?.setNextNode(node);
    this.tail = node;
    return node;
  }

  isEmpty() {
    return !this.head.hasNext();
  }

  getHead() {
    return this.head;
  }

  getTail() {
    return this.tail;
  }

  toArray() {
    const arr = [];
    let cur = this.head;
    while (cur.hasNext()) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      cur = cur.getNext()!;
      arr.push(cur);
    }

    return arr;
  }
}
