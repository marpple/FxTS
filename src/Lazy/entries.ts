import type Key from "../types/Key";

type NumberToString<T extends number> = `${T}` extends infer R extends string
  ? R
  : never;

type Entries<T extends Record<Key, any>, K extends keyof T> = K extends number
  ? [NumberToString<K>, T[K]]
  : K extends Key
  ? [K, T[K]]
  : never;

/**
 *
 * Returns an iterator of the own enumerable string keyed-value pairs.
 *
 * @example
 * ```ts
 *
 * [...entries({ a: 1, b: "2", c: true })]
 * // [["a", 1], ["b", "2"], ["c", true]]
 * ```
 *
 *
 * see {@link https://fxts.dev/docs/fromEntries | fromEntries}
 */

function* entries<T extends Record<Key, any>>(
  obj: T,
): Generator<Entries<T, keyof T>, void> {
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      yield [k, obj[k]] as any;
    }
  }
}

export default entries;
