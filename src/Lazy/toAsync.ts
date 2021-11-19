/**
 * Returns AsyncIterable, `toAsync` used when you want to handle Promise values inside Iterable.
 *
 * @example
 * ```ts
 * let acc = 0;
 * for await (const item of toAsync([1, 2, 3, 4, 5])) {
 *   acc += item;
 * }
 * // acc: 15
 *
 * // with pipe
 * await pipe(
 *  [Promise.resolve(1),Promise.resolve(2),Promise.resolve(3)],
 *  toAsync,
 *  map(a => a + 10),
 *  toArray, // [11, 12, 13]
 * );
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-toasync-00nxr | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
function toAsync<T>(iter: Iterable<T | Promise<T>>): AsyncIterableIterator<T> {
  const iterator = iter[Symbol.iterator]();
  return {
    async next() {
      const { value, done } = iterator.next();
      if (value instanceof Promise) {
        return value.then((value) => ({ done, value }));
      } else {
        return { done, value };
      }
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

export default toAsync;
