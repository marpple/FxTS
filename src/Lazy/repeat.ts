function* sync<T>(n: number, value: T): IterableIterator<T> {
  for (let i = 0; i < n; i++) {
    yield value;
  }
}

/**
 * Returns a Iterable/AsyncIterable of size n containing a specified value.
 *
 * @example
 * ```ts
 * const iter = repeat(2, 10);
 * iter.next(); // {value: 10, done:false}
 * iter.next(); // {value: 10, done:false}
 * iter.next(); // {value: undefined, done:true}
 *
 * // with pipe
 * pipe(
 *   repeat(2, 10),
 *   toArray,
 * ); // [10, 10]
 * ```
 */
function repeat<T>(n: number, value: T): IterableIterator<T>;

function repeat<T>(n: number): (value: T) => IterableIterator<T>;

function repeat<T>(
  n: number,
  value?: T,
): IterableIterator<T> | ((value: T) => IterableIterator<T>) {
  if (value === undefined) {
    return (value: T) => {
      return repeat(n, value);
    };
  }

  return sync(n, value);
}

export default repeat;
