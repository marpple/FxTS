/**
 *
 * Creates an array of the own enumerable property names of object.
 *
 * @example
 * ```ts
 * [...keys({ a: 1, b: "2", c: true })]
 * // ["a", "b", "c"]
 * ```
 */

function* keys<T extends Record<string, any>>(obj: T) {
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      yield k;
    }
  }
}

export default keys;
