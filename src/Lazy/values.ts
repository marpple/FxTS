import type Key from "../types/Key";

type ValuesResult<T> = T extends Map<any, infer V>
  ? Generator<V, void>
  : T extends Set<infer V>
  ? Generator<V, void>
  : T extends Record<Key, any>
  ? Generator<T[keyof T], void>
  : never;

/**
 *
 * Returns an iterator of values.
 *
 * Supports plain objects, Map, and Set:
 * - For objects: returns own enumerable string keyed property values
 * - For Map: returns values
 * - For Set: returns values
 *
 * @example
 * ```ts
 * [...values({ a: 1, b: "2", c: true })]
 * // [1, "2", true]
 *
 * [...values(new Map([["a", 1], ["b", 2]]))]
 * // [1, 2]
 *
 * [...values(new Set([1, 2, 3]))]
 * // [1, 2, 3]
 * ```
 */

function values<T extends Map<any, any> | Set<any> | Record<Key, any>>(
  obj: T,
): ValuesResult<T>;

function* values(obj: any): Generator<any, void> {
  if (obj instanceof Map) {
    for (const value of obj.values()) {
      yield value;
    }
  } else if (obj instanceof Set) {
    for (const value of obj) {
      yield value;
    }
  } else {
    for (const k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        yield obj[k];
      }
    }
  }
}

export default values;
