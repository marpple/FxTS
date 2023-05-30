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
function isEmpty(value: unknown): boolean {
  if (typeof value === "number" || typeof value === "boolean") {
    return false;
  }

  if (typeof value === "undefined" || value === null) {
    return true;
  }

  if (value instanceof Date) {
    return false;
  }

  if (typeof value === "function") {
    return false;
  }

  if (value instanceof Object && !Object.keys(value).length) {
    return true;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return true;
    }
    return false;
  }

  if (value === "") {
    return true;
  }

  return false;
}

export default isEmpty;
