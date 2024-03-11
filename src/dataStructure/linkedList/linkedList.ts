import { LinkedListNode } from "./linkedListNode";

export class LinkedList<T> {
  private head: LinkedListNode<T>;
  private tail: LinkedListNode<T>;

  constructor() {
    this.head = new LinkedListNode(null as unknown as T);
    this.tail = new LinkedListNode(null as unknown as T);

    this.head.setNextNode(this.tail);
    this.tail.setPrevNode(this.head);
  }

  insertFirst(value: T): LinkedListNode<T> {
    const node = new LinkedListNode(value);
    if (this.isEmpty()) {
      this.tail.setPrevNode(node);
      this.head.setNextNode(node);

      node.setNextNode(this.tail);
      node.setPrevNode(this.head);
    } else {
      const firstNode = this.head.getNext();
      if (!firstNode) {
        throw new TypeError("firstNode must be a LinkedListNode");
      }

      node.setPrevNode(this.head);
      node.setNextNode(firstNode);
      firstNode.setPrevNode(node);
      this.head.setNextNode(node);
    }

    return node;
  }

  insertLast(value: T): LinkedListNode<T> {
    if (this.isEmpty()) {
      return this.insertFirst(value);
    }

    const node = new LinkedListNode(value);
    const lastNode = this.tail.getPrev();

    if (!lastNode) {
      throw new TypeError("lastNode must be a LinkedListNode");
    }

    node.setPrevNode(lastNode);
    node.setNextNode(this.tail);
    lastNode.setNextNode(node);
    this.tail.setPrevNode(node);

    return node;
  }

  isEmpty() {
    return this.head.getNext() === this.tail;
  }

  getHead() {
    return this.head;
  }

  getTail() {
    return this.tail;
  }

  getLastNode() {
    return this.tail.getPrev();
  }

  hasNext(node?: LinkedListNode<T> | null): node is LinkedListNode<T> {
    if (node == null) {
      return false;
    }

    return node.getNext() !== this.tail;
  }

  toArray() {
    const arr = [];
    let cur = this.head;
    while (cur.getNext() !== this.tail) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      cur = cur.getNext()!;
      arr.push(cur.getValue());
    }

    return arr;
  }
}
