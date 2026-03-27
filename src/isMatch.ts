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
 * isMatch([1, 2, 3], [1, 2]); // true
 * isMatch([1, 2], [1, 2, 3]); // false
 *
 * // Map matching
 * const map1 = new Map([["key1", "value1"], ["key2", "value2"]]);
 * const map2 = new Map([["key1", "value1"]]);
 * isMatch(map1, map2); // true
 *
 * // Set matching
 * const set1 = new Set([1, 2, 3]);
 * const set2 = new Set([1, 2]);
 * isMatch(set1, set2); // true
 *
 * // Date type matching
 * const now = Date.now();
 * isMatch(new Date(now), new Date(now)); // true
 *
 * // RegExp type matching
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

  if (typeof source !== "object") {
    return source === object || (source !== source && object !== object);
  }

  if (source instanceof Date || object instanceof Date) {
    if (!(source instanceof Date && object instanceof Date)) return false;
    return source.getTime() === object.getTime();
  }

  if (source instanceof RegExp || object instanceof RegExp) {
    if (!(source instanceof RegExp && object instanceof RegExp)) return false;
    return source.source === object.source && source.flags === object.flags;
  }

  if (source instanceof Map || object instanceof Map) {
    if (!(source instanceof Map && object instanceof Map)) return false;
    if (source.size > object.size) return false;
    for (const [key, value] of source) {
      if (!object.has(key) || !isMatch(object.get(key), value)) {
        return false;
      }
    }
    return true;
  }

  if (source instanceof Set || object instanceof Set) {
    if (!(source instanceof Set && object instanceof Set)) return false;
    if (source.size > object.size) return false;
    const sourceValues = Array.from(source);
    const objectValues = Array.from(object);
    const assignedSource = new Array<number>(objectValues.length).fill(-1);

    const findMatchingPath = (
      sourceIndex: number,
      visited: Set<number>,
    ): boolean => {
      for (
        let objectIndex = 0;
        objectIndex < objectValues.length;
        objectIndex++
      ) {
        if (visited.has(objectIndex)) continue;
        if (!isMatch(objectValues[objectIndex], sourceValues[sourceIndex]))
          continue;
        visited.add(objectIndex);
        if (
          assignedSource[objectIndex] === -1 ||
          findMatchingPath(assignedSource[objectIndex], visited)
        ) {
          assignedSource[objectIndex] = sourceIndex;
          return true;
        }
      }
      return false;
    };

    for (let si = 0; si < sourceValues.length; si++) {
      if (!findMatchingPath(si, new Set())) return false;
    }
    return true;
  }

  if (Array.isArray(source) && Array.isArray(object)) {
    if (source.length > object.length) return false;
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
