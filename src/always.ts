/**
 * Returns a function that always returns the given value.
 *
 * @example
 * ```ts
 * const alwaysFive = always(5);
 * alwaysFive(); // 5
 *
 * const defaultToEmpty = always("");
 * await Promise.reject("error during operation").catch(defaultToEmpty); // ""
 *
 * // with pipe
 * const excludeNegatives = false;
 * pipe(
 *  [-1, 1, 2, 0 ,-3],
 *  filter(excludeNegatives ? lt(0) : always(true)),
 *  toArray,
 * ); // [-1, 1, 2, 0 ,-3]
 * ```
 */

function always<T>(value: T): (...args: any[]) => T {
  return () => value;
}

export default always;
