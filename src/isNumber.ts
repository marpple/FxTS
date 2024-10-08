/**
 * Returns true if `n` is a Number.
 *
 * @example
 * ```ts
 * isNumber(2); // true
 * isNumber("a"); // false
 * ```
 */
const isNumber = (input: unknown): input is number => typeof input === "number";
export default isNumber;
