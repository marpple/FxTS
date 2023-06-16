import type Include from "./types/Include";

/**
 * Returns true if `n` is a Number.
 *
 * @example
 * ```ts
 * isNumber(2); // true
 * isNumber("a"); // false
 * ```
 */
const isNumber = <T>(n: T): n is Include<T, number> => typeof n === "number";

export default isNumber;
