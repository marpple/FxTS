import type Include from "./types/Include";

/**
 * Returns true if `s` is a String.
 *
 * @example
 * ```ts
 * isString("a"); // true
 * isString(2); // false
 * ```
 */
const isString = <T>(s: T): s is Include<T, string> => typeof s === "string";

export default isString;
