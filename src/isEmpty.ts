import isArray from "./isArray";
import isNil from "./isNil";

/**
 * Returns true if the given value is empty value, false otherwise.
 *
 * @example
 * ```ts
 * isEmpty(1); // false
 * isEmpty(0); // false
 * isEmpty(false); // false
 * isEmpty(true); // false
 * isEmpty(new Date()); // false
 * isEmpty(undefined); // true
 * isEmpty(null); // true
 *
 * isEmpty({}); // true
 * isEmpty({a:1}); // false
 *
 * isEmpty([]); // true
 * isEmpty([1]); // false
 *
 * isEmpty(""); // true
 * isEmpty("a"); // false
 *
 * isEmpty(function(){}); // false
 * isEmpty(Symbol("")); // false
 * ```
 */
export const isEmpty = (value: unknown): boolean => {
  if (isNil(value)) return true; // if value is null or undefined.

  if (
    typeof value === "object" &&
    (value as object)["constructor"] === Object &&
    Object.getOwnPropertyNames(value).length === 0
  )
    return true; // if value is a literal object and have no property.

  if (isArray(value) && value.length === 0) return true; // if value have no item.

  if (value === "") return true;

  return false;
};

export default isEmpty;
