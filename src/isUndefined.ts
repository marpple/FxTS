import type Include from "./types/Include";

/**
 * Checks if the given value is `undefined`.
 *
 * @example
 * ```ts
 * isUndefined(undefined); // true
 * isUndefined(2); // false
 * ```
 */
const isUndefined = <T>(a: T): a is Include<T, undefined> => a === undefined;

export default isUndefined;
