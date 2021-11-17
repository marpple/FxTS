/**
 * Returns true if `s` is a String.
 *
 * @example
 * ```ts
 * isString("a"); // true
 * isString(2); // false
 * ```
 */
function isString(s: unknown): s is string {
  return typeof s === "string";
}

export default isString;
