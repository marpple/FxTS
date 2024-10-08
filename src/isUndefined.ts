/**
 * Checks if the given value is `undefined`.
 *
 * @example
 * ```ts
 * isUndefined(undefined); // true
 * isUndefined(2); // false
 * ```
 */
const isUndefined = <T>(input: T): input is T & undefined =>
  input === undefined;

export default isUndefined;
