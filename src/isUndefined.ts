/**
 * Checks if the given value is `undefined`.
 *
 * @example
 * ```ts
 * isUndefined(undefined); // true
 * isUndefined(2); // false
 * ```
 */
const isUndefined = <T>(a: T | undefined): a is undefined => a === undefined;

export default isUndefined;
