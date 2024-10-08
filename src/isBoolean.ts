/**
 * Returns true if `n` is a Boolean.
 *
 * @example
 * ```ts
 * isBoolean(true); // true
 * isBoolean(null); // false
 * isBoolean("FxTS"); // false
 * ```
 */
const isBoolean = (input: unknown): input is boolean =>
  typeof input === "boolean";
export default isBoolean;
