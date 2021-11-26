function* sync<A, B>(f: (a: A) => B, iterable: Iterable<A>) {
  const iterator = iterable[Symbol.iterator]();
  const iterableIterator = {
    [Symbol.iterator]() {
      return iterator;
    },
  };

  for (const a of iterableIterator) {
    if (!f(a)) {
      continue;
    } else {
      break;
    }
  }

  yield* iterableIterator;
}

function dropUntil<A, B = unknown>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): IterableIterator<A>;

function dropUntil<A, B>(f: (a: A) => B, iterable: Iterable<A>) {
  return sync(f, iterable);
}

export default dropUntil;
