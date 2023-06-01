import isNull from "./isNull";
import isUndefined from "./isUndefined";

type Nullable<T> = T extends null | undefined ? T : never;

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
const isNil = <T>(a: T): a is Nullable<T> => isUndefined(a) || isNull(a);

export default isNil;
