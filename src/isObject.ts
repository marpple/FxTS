import type Include from "./types/Include";

/**
 * Checks if value is the type of object.
 *
 * @example
 * ```ts
 * isObject({}); // true
 * isObject([1, 2, 3]); // true
 * isObject(() => {}); // true
 * isObject(null); // false
 * isObject(123); // false
 * ```
 */
const isObject = <T>(a: T): a is Include<T, object> => {
  const type = typeof a;
  return a != null && (type === "object" || type === "function");
};

export default isObject;
