/**
 * Returns true if `a` is an Array.
 *
 * @example
 * ```ts
 * isArray([1, 2, 3]); // true
 * isArray(2); // false
 * ```
 */
const isArray = (input: unknown): input is unknown[] | Readonly<unknown[]> =>
  Array.isArray(input);

export default isArray;
