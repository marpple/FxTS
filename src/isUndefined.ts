/**
 * Returns true if `a` is a undefined.
 *
 * @example
 * ```ts
 * isUndefined(undefined); // true
 * isUndefined(2); // false
 * ```
 */
function isUndefined<T>(a: T | undefined): a is undefined {
  return typeof a === "undefined";
}

export default isUndefined;
