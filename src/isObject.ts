import isNull from "./isNull";

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
const isObject = (input: unknown): input is object => {
  const type = typeof input;
  return !isNull(input) && (type === "object" || type === "function");
};

export default isObject;
