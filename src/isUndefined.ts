/**
 * Checks if the given value is `undefined`.
 *
 * @example
 * ```ts
 * isUndefined(undefined); // true
 * isUndefined(2); // false
 * ```
 */
const isUndefined = (input: unknown): input is undefined => input === undefined;

export default isUndefined;
