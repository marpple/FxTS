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

type IdentityObject<T> = T extends object ? T : never;

function isObject<T = unknown>(a: T): a is IdentityObject<T> {
  const type = typeof a;
  return a != null && (type === "object" || type === "function");
}

export default isObject;
