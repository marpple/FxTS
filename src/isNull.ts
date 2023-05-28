/**
 * Checks if the given value is `null`.
 *
 * @example
 * ```ts
 * isNull(1); // false
 * isNull('1'); // false
 * isNull(undefined); // false
 * isNull(null); // true
 * ```
 */
export const isNull = <T>(input: T | null): input is T => input === null;

export default isNull;
