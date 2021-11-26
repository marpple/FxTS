function* sync<A, B>(f: (a: A) => B, iterable: Iterable<A>) {
  for (const a of iterable) {
    if (f(a)) {
      continue;
    }
    yield a;
  }
}

function dropWhile<A, B>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): IterableIterator<A>;

function dropWhile<A, B>(f: (a: A) => B, iterable: Iterable<A>) {
  return sync(f, iterable);
}

export default dropWhile;
