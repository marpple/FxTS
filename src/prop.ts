/**
 *
 * Returns a function that when supplied an object returns the indicated property of that object, if it exists.
 *
 * @example
 * ```ts
 * const arr = [1, 2, 3, 4, 5];
 * const n = prop(0, arr); // number
 *
 * const obj = {a: "1", b: 2};
 * const s = prop('a', obj); // string
 * const n = prop('b', obj); // number
 *
 * pipe(
 *  [{name:"foo", value: "bar"}, {name:"foo2", value: "bar2"}],
 *  map(prop('name')),
 *  toArray,
 * ); // ["foo", "foo2"]
 * ```
 */
export function prop<O extends object, K extends keyof O>(
  a: K,
): (obj: O) => O[K];

export function prop<O extends object, K extends keyof O>(a: K, obj: O): O[K];

export function prop<O extends object, K extends keyof O>(a: K, obj?: O): any {
  if (obj === undefined) {
    return (obj2: O): O[K] => {
      return obj2[a];
    };
  }

  return obj[a];
}

export default prop;
