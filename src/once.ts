/**
 * Creates a function that invokes `f` only on its first call.
 * Subsequent calls return the result of the first invocation
 * without calling `f` again.
 *
 * The returned function preserves `this` and the arguments of `f`.
 *
 * @example
 * ```ts
 * let count = 0;
 * const init = once((a: number) => {
 *   count += 1;
 *   return a * 10;
 * });
 *
 * init(1); // 10 - `f` is called
 * init(2); // 10 - `f` is not called again, first result is returned
 * count; // 1
 * ```
 */
function once<F extends (...args: any[]) => any>(f: F): F {
  let called = false;
  let result: ReturnType<F>;

  return function (this: unknown, ...args: Parameters<F>) {
    if (!called) {
      called = true;
      result = f.apply(this, args);
    }
    return result;
  } as F;
}

export default once;
