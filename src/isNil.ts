import isNull from "./isNull";
import isUndefined from "./isUndefined";
import type Include from "./types/Include";

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
const isNil = <T>(a: T): a is Include<T, null | undefined> =>
  isUndefined(a) || isNull(a);

export default isNil;
