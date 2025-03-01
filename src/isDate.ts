/**
 * Returns true if `input` is a Date object.
 *
 * @example
 * ```ts
 * isDate(new Date()); // true
 * isDate("2024-01-01"); // false
 * ```
 */
const isDate = <T>(input: T): input is Extract<T, Date> => {
  return input instanceof Date;
};

export default isDate;
