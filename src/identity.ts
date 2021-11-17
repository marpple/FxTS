/**
 * Returns the same value the is used as the argument.
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
