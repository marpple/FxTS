import { isPromise } from "./_internal/utils";

/**
 * Returns a new object with the same values as `obj`, where each key is the
 * result of applying `f` to the original value and key.
 * When multiple keys map to the same new key, the last one wins.
 *
 * @example
 * ```ts
 * mapKeys((v, k) => k.toUpperCase(), { a: 1, b: 2 }); // { A: 1, B: 2 }
 * mapKeys((v) => String(v), { a: 1 }); // { "1": 1 }
 *
 * // asynchronous callback
 * await mapKeys(async (v, k) => k.toUpperCase(), { a: 1 }); // { A: 1 }
 *
 * // with pipe
 * pipe(
 *   { a: 1, b: 2 },
 *   mapKeys((v, k) => k.toUpperCase()),
 * ); // { A: 1, B: 2 }
 * ```
 */
function mapKeys<T extends object, K2 extends PropertyKey>(
  f: (value: T[keyof T], key: keyof T & string) => Promise<K2>,
  obj: T,
): Promise<Record<K2, T[keyof T]>>;

function mapKeys<T extends object, K2 extends PropertyKey>(
  f: (value: T[keyof T], key: keyof T & string) => K2,
  obj: T,
): Record<K2, T[keyof T]>;

function mapKeys<T extends object, K2 extends PropertyKey>(
  f: (value: T[keyof T], key: keyof T & string) => Promise<K2>,
): (obj: T) => Promise<Record<K2, T[keyof T]>>;

function mapKeys<T extends object, K2 extends PropertyKey>(
  f: (value: T[keyof T], key: keyof T & string) => K2,
): (obj: T) => Record<K2, T[keyof T]>;

function mapKeys<T extends object, K2 extends PropertyKey>(
  f: (value: T[keyof T], key: keyof T & string) => K2 | Promise<K2>,
  obj?: T,
):
  | Record<K2, T[keyof T]>
  | Promise<Record<K2, T[keyof T]>>
  | ((obj: T) => Record<K2, T[keyof T]> | Promise<Record<K2, T[keyof T]>>) {
  if (obj === undefined) {
    return (obj: T) =>
      mapKeys(f as (value: T[keyof T], key: keyof T & string) => K2, obj);
  }

  const keys = Object.keys(obj) as (keyof T & string)[];
  const newKeys = keys.map((key) => f(obj[key] as T[keyof T], key));

  if (newKeys.some(isPromise)) {
    return Promise.all(newKeys).then((resolved) => {
      const result = {} as Record<K2, T[keyof T]>;
      keys.forEach((key, i) => (result[resolved[i]] = obj[key] as T[keyof T]));
      return result;
    });
  }

  const result = {} as Record<K2, T[keyof T]>;
  keys.forEach((key, i) => (result[newKeys[i] as K2] = obj[key] as T[keyof T]));
  return result;
}

export default mapKeys;
