import type Key from "./types/Key";

type PropsTuple<K extends readonly Key[], T> = {
  -readonly [I in keyof K]: T extends null
    ? undefined
    : K[I] extends keyof T
    ? T[K[I]]
    : undefined;
};

type PropsReturnType<
  K extends readonly Key[],
  T,
> = undefined[] extends PropsTuple<K, T>
  ? keyof T extends K[keyof K]
    ? (NonNullable<T>[keyof NonNullable<T>] | undefined)[]
    : undefined[]
  : PropsTuple<K, T>;

/**
 * Returns an array containing the values of the specified props in the given object.
 *
 * @example
 * ```ts
 * // get the `name` and `age` properties from an object
 * const person = { name: "John", age: 30, address: "123 Main St" };
 * const [name, age, phone] = props(["name", "age", "phone"], person); // ["John", 30, undefined]
 *
 * // with pipe
 * pipe(
 *  person,
 *  props(["name", "age", "phone"]),
 * );
 *
 * // get the `address` and `phone` properties from an object that may be null or undefined
 * const maybePerson = null;
 * const [address, phone] = props(["address", "phone"], maybePerson); // [undefined, undefined]
 * ```
 */
function props<K extends readonly Key[], T>(
  key: K,
  obj: T,
): PropsReturnType<K, T>;
function props<K extends readonly Key[]>(
  key: K,
): <T>(obj: T) => PropsReturnType<K, T>;

function props<K extends Key[], T>(keys: K, obj?: T) {
  if (obj === null) return new Array(keys.length).fill(undefined);
  if (obj === undefined) return <T>(obj: T) => props(keys, obj);

  const result = [];

  for (const key of keys) result.push(obj[key as keyof T]);

  return result;
}

export default props;
