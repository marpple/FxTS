import isArray from "./isArray";
import isNil from "./isNil";

/**
 * Returns true if the given value is empty value, false otherwise.
 *
 * @example
 * ```ts
 * isEmpty({}) // true
 * isEmpty([]) // true
 * isEmpty(null) // true
 * isEmpty(undefined) // true
 * isEmpty("") // true
 *
 * isEmpty(0) // false
 * isEmpty(false) // false
 * isEmpty(function(){}) // false
 * isEmpty(Symbol("")) // false
 * isEmpty(new Date()) // false
 * ```
 */
export const isEmpty = (value: unknown): boolean => {
  if (isNil(value)) return true; // if value is null or undefined.

  if (
    typeof value === "object" &&
    (value as object)["constructor"] === Object &&
    Object.getOwnPropertyNames(value).length === 0
  )
    return true; // if value is a literal object and have no property or method.

  if (isArray(value) && value.length === 0) return true; // if value have no item.

  if (value === "") return true;

  return false;
};

export default isEmpty;
