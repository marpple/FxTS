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
const isNull = <T>(input: T | null): input is null => input === null;

export default isNull;
