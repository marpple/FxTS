/**
 * Returns true if `s` is a String.
 *
 * @example
 * ```ts
 * isString("a"); // true
 * isString(2); // false
 * ```
 */
const isString = <T>(input: T): input is T & string =>
  typeof input === "string";

export default isString;
