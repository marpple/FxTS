import isNil from "./isNil";

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
const isObject = <T>(input: T): input is T & object => {
  const type = typeof input;
  return !isNil(input) && (type === "object" || type === "function");
};

export default isObject;
