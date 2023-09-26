type Entries<
  T extends Record<string, any>,
  K extends keyof T,
> = K extends string ? [K, T[K]] : never;

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

function* entries<T extends Record<string, any>>(
  obj: T,
): Generator<Entries<T, keyof T>, void> {
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      yield [k, obj[k]] as any;
    }
  }
}

export default entries;
