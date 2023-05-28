import isUndefined from "./isUndefined";

/**
 * Returns true if `a` is not a undefined.
 *
 * @example
 * ```ts
 * isDefined(undefined); // false
 * isDefined(null) // true
 * isDefined(2); // true
 * ```
 */
export const isDefined = <T>(a: T | undefined): a is T => !isUndefined(a);

export default isDefined;
