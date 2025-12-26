import type Key from "../types/Key";

type KeysResult<T> = T extends Map<infer K, any>
  ? Generator<K, void>
  : T extends Set<infer V>
  ? Generator<V, void>
  : T extends Record<Key, any>
  ? Generator<keyof T, void>
  : never;

/**
 *
 * Returns an iterator of keys.
 *
 * Supports plain objects, Map, and Set:
 * - For objects: returns own enumerable string keyed property names
 * - For Map: returns keys
 * - For Set: returns values (Set keys are the same as values)
 *
 * @example
 * ```ts
 * [...keys({ a: 1, b: "2", c: true })]
 * // ["a", "b", "c"]
 *
 * [...keys(new Map([["a", 1], ["b", 2]]))]
 * // ["a", "b"]
 *
 * [...keys(new Set([1, 2, 3]))]
 * // [1, 2, 3]
 * ```
 */

function keys<T extends Map<any, any> | Set<any> | Record<Key, any>>(
  obj: T,
): KeysResult<T>;

function* keys(obj: any): Generator<any, void> {
  if (obj instanceof Map) {
    for (const key of obj.keys()) {
      yield key;
    }
  } else if (obj instanceof Set) {
    for (const value of obj) {
      yield value;
    }
  } else {
    for (const k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        yield k;
      }
    }
  }
}

export default keys;
