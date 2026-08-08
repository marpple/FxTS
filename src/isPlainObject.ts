/**
 * Checks if `value` is a plain object, that is, an object whose prototype is
 * `Object.prototype` (e.g. object literals, `new Object()`) or `null`
 * (`Object.create(null)`).
 *
 * Unlike `isObject`, which returns `true` for any non-primitive value
 * including arrays and functions, `isPlainObject` returns `false` for
 * arrays, functions, class instances and built-in objects such as
 * `Date`, `Map` and `Set`.
 *
 * @example
 * ```ts
 * isPlainObject({}); // true
 * isPlainObject({ a: 1 }); // true
 * isPlainObject(Object.create(null)); // true
 * isPlainObject([1, 2, 3]); // false
 * isPlainObject(() => {}); // false
 * isPlainObject(new Date()); // false
 * isPlainObject(null); // false
 * isPlainObject(123); // false
 * ```
 */
const isPlainObject = (
  value: unknown,
): value is Record<PropertyKey, unknown> => {
  if (typeof value !== "object" || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

export default isPlainObject;
