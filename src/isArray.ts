import type Include from "./types/Include";

/**
 * Returns true if `a` is an Array.
 *
 * @example
 * ```ts
 * isArray([1, 2, 3]); // true
 * isArray(2); // false
 * ```
 */
const isArray = <T>(a: T): a is Include<T, unknown[] | Readonly<unknown[]>> =>
  Array.isArray(a);

export default isArray;
