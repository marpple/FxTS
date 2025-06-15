/**
 * Returns true if `a` is an Array.
 *
 * @example
 * ```ts
 * isArray([1, 2, 3]); // true
 * isArray(2); // false
 * ```
 */
const isArray = <T>(
  input: T,
): input is Extract<T, unknown[] | Readonly<unknown[]>> => Array.isArray(input);

export default isArray;
