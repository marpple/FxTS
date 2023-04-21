import type Key from "./types/Key";

type Prop<T, K extends Key> = T extends null
  ? undefined
  : K extends keyof T
  ? T[K]
  : undefined;

/**
 * Get the value of a property from an object, or return undefined if the property does not exist on the object.
 *
 * @example
 * ```ts
 * // get the `name` property from an object
 * const person = { name: "John", age: 30 };
 * const name = prop("name", person); // "John"
 *
 * // with pipe
 * pipe(
 *  person,
 *  prop("name"),
 * );
 *
 * // get the `address` property from an object that may be null or undefined
 * const maybePerson = null;
 * const address = prop("address", maybePerson); // undefined
 * ```
 */
function prop<K extends Key, T>(key: K, obj: T): Prop<T, K>;
function prop<K extends Key>(key: K): <T>(obj: T) => Prop<T, K>;

function prop<K extends Key, T>(key: K, obj?: T) {
  if (obj === null) return undefined;
  if (obj === undefined) return <T>(obj: T) => prop(key, obj);

  return obj[key as unknown as keyof T];
}

export default prop;
