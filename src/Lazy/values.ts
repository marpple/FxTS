/**
 *
 * Returns an iterator of the own enumerable string keyed property values of object.
 *
 * @example
 * ```ts
 * [...values({ a: 1, b: "2", c: true })]
 * // [1, "2", true]
 * ```
 */

function* values<T extends Record<string, any>>(obj: T) {
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      yield obj[k];
    }
  }
}

export default values;
