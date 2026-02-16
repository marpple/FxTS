import isNil from "./isNil";

/**
 * Performs a partial deep comparison between `object` and `source` to determine
 * if `object` contains all property values from `source`.
 *
 * Used as the internal comparison logic for the `matches` function.
 * `source` only needs to match a subset of `object`'s properties.
 *
 * Supported types: primitives, Object (including nested), Array, Date, RegExp, Map, Set.
 *
 * @example
 * ```ts
 * // Partial object matching
 * isMatch({ a: 1, b: 2 }, { a: 1 }); // true
 * isMatch({ a: 1 }, { a: 1, b: 2 }); // false - object is missing 'b'
 *
 * // Nested object matching
 * isMatch({ user: { name: "John", age: 30 } }, { user: { name: "John" } }); // true
 * isMatch({ user: { name: "John" } }, { user: { name: "Jane" } }); // false
 *
 * // Array matching (must match exactly)
 * isMatch([1, 2, 3], [1, 2, 3]); // true
 * isMatch([1, 2], [1, 2, 3]); // false
 *
 * // Special type matching
 * isMatch(new Date("2024-01-01"), new Date("2024-01-01")); // true
 * isMatch(/abc/gi, /abc/gi); // true
 *
 * // Empty source always returns true
 * isMatch({ a: 1, b: 2 }, {}); // true
 * ```
 */
function isMatch(object: unknown, source: unknown): boolean {
  if (source === object) return true;

  if (isNil(object) || isNil(source)) return false;

  if (typeof source !== typeof object) return false;

  if (typeof source !== "object") return source === object;

  if (source instanceof Date && object instanceof Date) {
    return source.getTime() === object.getTime();
  }

  if (source instanceof RegExp && object instanceof RegExp) {
    return source.source === object.source && source.flags === object.flags;
  }

  if (source instanceof Map && object instanceof Map) {
    if (source.size !== object.size) return false;
    for (const [key, value] of source) {
      if (!object.has(key) || !isMatch(object.get(key), value)) {
        return false;
      }
    }
    return true;
  }

  if (source instanceof Set && object instanceof Set) {
    if (source.size !== object.size) return false;
    for (const value of source) {
      let found = false;
      for (const objValue of object) {
        if (isMatch(objValue, value)) {
          found = true;
          break;
        }
      }
      if (!found) return false;
    }
    return true;
  }

  if (Array.isArray(source) && Array.isArray(object)) {
    if (source.length !== object.length) return false;
    for (let i = 0; i < source.length; i++) {
      if (!isMatch(object[i], source[i])) return false;
    }
    return true;
  }

  if (Array.isArray(source) !== Array.isArray(object)) return false;

  const sourceObj = source as Record<string, unknown>;
  const objectObj = object as Record<string, unknown>;

  for (const key of Object.keys(sourceObj)) {
    if (
      !Object.prototype.hasOwnProperty.call(objectObj, key) ||
      !isMatch(objectObj[key], sourceObj[key])
    ) {
      return false;
    }
  }

  return true;
}

export default isMatch;
