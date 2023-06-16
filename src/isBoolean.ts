import type Include from "./types/Include";

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
const isBoolean = <T>(n: T): n is Include<T, boolean> => typeof n === "boolean";

export default isBoolean;
