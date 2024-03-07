export class LinkedListNode<T> {
  private value: T;
  private next: LinkedListNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }

  setNextNode(node: LinkedListNode<T> | null) {
    this.next = node;

    return node;
  }

  getValue() {
    return this.value;
  }

  getNext() {
    return this.next;
  }

  hasNext() {
    return this.next instanceof LinkedListNode;
  }
}
