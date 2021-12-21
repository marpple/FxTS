/**
 * Returns true if `n` is a Number.
 *
 * @example
 * ```ts
 * isNumber("a"); // true
 * isNumber(2); // false
 * ```
 */
function isNumber(n: unknown): n is number {
  return typeof n === "number";
}

export default isNumber;
