import type Include from "./types/Include";

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
const isNull = <T>(input: T): input is Include<T, null> => input === null;

export default isNull;
