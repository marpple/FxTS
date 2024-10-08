/**
 * Returns true if `n` is a Number.
 *
 * @example
 * ```ts
 * isNumber(2); // true
 * isNumber("a"); // false
 * ```
 */
const isNumber = <T>(input: T): input is T & number =>
  typeof input === "number";

export default isNumber;
