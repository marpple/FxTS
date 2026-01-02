import type Key from "../types/Key";

type NumberToString<T extends number> = `${T}` extends infer R extends string
  ? R
  : never;

type ObjectEntries<
  T extends Record<Key, any>,
  K extends keyof T,
> = K extends number
  ? [NumberToString<K>, T[K]]
  : K extends string
  ? [K, T[K]]
  : never;

type EntriesResult<T> = T extends Map<infer K, infer V>
  ? Generator<[K, V], void>
  : T extends Set<infer V>
  ? Generator<[V, V], void>
  : T extends Record<Key, any>
  ? Generator<ObjectEntries<T, keyof T>, void>
  : never;

/**
 *
 * Returns an iterator of key-value pairs.
 *
 * Supports plain objects, Map, and Set:
 * - For objects: returns own enumerable string keyed-value pairs
 * - For Map: returns [key, value] pairs
 * - For Set: returns [value, value] pairs
 *
 * @example
 * ```ts
 * [...entries({ a: 1, b: "2", c: true })]
 * // [["a", 1], ["b", "2"], ["c", true]]
 *
 * [...entries(new Map([["a", 1], ["b", 2]]))]
 * // [["a", 1], ["b", 2]]
 *
 * [...entries(new Set([1, 2, 3]))]
 * // [[1, 1], [2, 2], [3, 3]]
 * ```
 *
 * see {@link https://fxts.dev/api/fromEntries | fromEntries}
 */

function entries<T extends Map<any, any> | Set<any> | Record<Key, any>>(
  obj: T,
): EntriesResult<T>;

function* entries(obj: any): Generator<any, void> {
  if (obj instanceof Map) {
    for (const entry of obj.entries()) {
      yield entry;
    }
  } else if (obj instanceof Set) {
    for (const v of obj) {
      yield [v, v];
    }
  } else {
    for (const k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        yield [k, obj[k]];
      }
    }
  }
}

export default entries;
