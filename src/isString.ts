/**
 * Returns true if `s` is a String.
 *
 * @example
 * ```ts
 * isString("a"); // true
 * isString(2); // false
 * ```
 */
const isString = (input: unknown): input is string => typeof input === "string";
export default isString;
