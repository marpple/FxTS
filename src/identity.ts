/**
 * Returns the same value as the given argument.
 *
 * @example
 * ```ts
 * identity(5); // 5
 * ```
 */
function identity<T>(a: T) {
  return a;
}

export default identity;
