/**
 * Returns true if `value` is a Date object.
 *
 * @example
 * ```ts
 * isDate(new Date()); // true
 * isDate("2024-01-01"); // false
 * ```
 */
const isDate = <T>(input: T): input is T & Date => input instanceof Date;

export default isDate;
