/**
 * Returns true if `n` is a Number.
 *
 * @example
 * ```ts
 * isNumber(2); // true
 * isNumber("a"); // false
 * ```
 */
function isNumber(n: unknown): n is number {
  return typeof n === "number";
}

export default isNumber;
