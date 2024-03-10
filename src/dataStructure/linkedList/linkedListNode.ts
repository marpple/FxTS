export class LinkedListNode<T> {
  private value: T;
  private next: LinkedListNode<T> | null;
  private prev: LinkedListNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }

  setNextNode(node: LinkedListNode<T>) {
    this.next = node;

    return node;
  }

  setPrevNode(node: LinkedListNode<T>) {
    this.prev = node;

    return node;
  }

  getValue() {
    return this.value;
  }

  getNext() {
    return this.next;
  }

  getPrev() {
    return this.prev;
  }

  hasNext() {
    return this.next instanceof LinkedListNode;
  }
}
