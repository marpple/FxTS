/**
 * Returns true if `a` is a undefined.
 *
 * @example
 * ```ts
 * isUndefined(undefined); // true
 * isUndefined(2); // false
 * ```
 */
function isUndefined(a: any): a is undefined {
  return typeof a === "undefined";
}

export default isUndefined;
