import isNull from "./isNull";
import isUndefined from "./isUndefined";

/**
 * Checks if the given value is `null` or `undefined`.
 *
 * @example
 * ```ts
 * isNil(1); // false
 * isNil('1'); // false
 * isNil(undefined); // true
 * isNil(null); // true
 * ```
 */
const isNil = (input: unknown): input is null | undefined =>
  isUndefined(input) || isNull(input);
export default isNil;
