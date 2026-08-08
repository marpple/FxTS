import isNil from "./isNil";

/**
 * Checks whether `bs` is a permutation of `as` under `isEqual`.
 *
 * Unlike the bipartite matching in `isMatch`, a greedy first-match search is
 * sufficient here because deep equality is an equivalence relation:
 * values equal to the same value are interchangeable as match partners.
 */
const isPermutation = (as: unknown[], bs: unknown[]): boolean => {
  const used = new Array<boolean>(bs.length).fill(false);
  for (const value of as) {
    let matched = false;
    for (let i = 0; i < bs.length; i++) {
      if (used[i] || !isEqual(value, bs[i])) continue;
      used[i] = true;
      matched = true;
      break;
    }
    if (!matched) return false;
  }
  return true;
};

/**
 * Performs a deep equality comparison between `a` and `b`.
 *
 * Unlike `isMatch`, which performs a partial comparison where `source` only
 * needs to match a subset of properties, `isEqual` requires complete equality
 * in both directions: objects must have the same set of keys, arrays the same
 * length and order, and Map/Set the same size.
 *
 * Supported types: primitives (`NaN` is treated as equal to `NaN`),
 * Object (nested, key order irrelevant), Array (order sensitive),
 * Date (compared by `getTime`), RegExp (compared by `source` and `flags`),
 * Map (keys and values are deeply compared), Set (order irrelevant).
 * Values of different types are never equal, and functions are compared by
 * reference only.
 *
 * @example
 * ```ts
 * // Primitives (NaN equals NaN)
 * isEqual(1, 1); // true
 * isEqual(NaN, NaN); // true
 * isEqual("a", "b"); // false
 *
 * // Full equality, unlike isMatch's partial matching
 * isEqual({ a: 1, b: 2 }, { a: 1 }); // false - key counts differ
 * isMatch({ a: 1, b: 2 }, { a: 1 }); // true - subset is enough
 *
 * // Nested objects (key order irrelevant)
 * isEqual({ a: 1, b: { c: 2 } }, { b: { c: 2 }, a: 1 }); // true
 * isEqual({ a: 1 }, { a: 1, b: undefined }); // false - key counts differ
 *
 * // Arrays (order sensitive)
 * isEqual([1, 2, 3], [1, 2, 3]); // true
 * isEqual([1, 2, 3], [3, 2, 1]); // false
 *
 * // Date and RegExp
 * isEqual(new Date(1000), new Date(1000)); // true
 * isEqual(/abc/gi, /abc/gi); // true
 *
 * // Map (keys and values are deeply compared)
 * isEqual(new Map([[{ a: 1 }, 1]]), new Map([[{ a: 1 }, 1]])); // true
 *
 * // Set (order irrelevant)
 * isEqual(new Set([1, 2, 3]), new Set([3, 2, 1])); // true
 *
 * // Different types are never equal
 * isEqual(new Date(0), {}); // false
 * isEqual(null, {}); // false
 * ```
 */
function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (isNil(a) || isNil(b)) return false;

  if (typeof a !== typeof b) return false;

  if (typeof a !== "object") {
    return a === b || (a !== a && b !== b);
  }

  if (a instanceof Date || b instanceof Date) {
    if (!(a instanceof Date && b instanceof Date)) return false;
    return a.getTime() === b.getTime();
  }

  if (a instanceof RegExp || b instanceof RegExp) {
    if (!(a instanceof RegExp && b instanceof RegExp)) return false;
    return a.source === b.source && a.flags === b.flags;
  }

  if (a instanceof Map || b instanceof Map) {
    if (!(a instanceof Map && b instanceof Map)) return false;
    if (a.size !== b.size) return false;
    let sameByKeyLookup = true;
    for (const [key, value] of a) {
      if (!b.has(key) || !isEqual(b.get(key), value)) {
        sameByKeyLookup = false;
        break;
      }
    }
    // Key lookup uses SameValueZero, so fall back to unordered entry
    // matching for keys that are deeply equal but distinct objects.
    return sameByKeyLookup || isPermutation(Array.from(a), Array.from(b));
  }

  if (a instanceof Set || b instanceof Set) {
    if (!(a instanceof Set && b instanceof Set)) return false;
    if (a.size !== b.size) return false;
    let sameByValueLookup = true;
    for (const value of a) {
      if (!b.has(value)) {
        sameByValueLookup = false;
        break;
      }
    }
    return sameByValueLookup || isPermutation(Array.from(a), Array.from(b));
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!(Array.isArray(a) && Array.isArray(b))) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const aKeys = Object.keys(aObj);

  if (aKeys.length !== Object.keys(bObj).length) return false;

  for (const key of aKeys) {
    if (
      !Object.prototype.hasOwnProperty.call(bObj, key) ||
      !isEqual(aObj[key], bObj[key])
    ) {
      return false;
    }
  }

  return true;
}

export default isEqual;
