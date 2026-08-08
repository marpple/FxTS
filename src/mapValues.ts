import { isPromise } from "./_internal/utils";

/**
 * Returns a new object with the same keys as `obj`, where each value is the
 * result of applying `f` to the original value (and its key).
 *
 * @example
 * ```ts
 * mapValues((v) => v * 2, { a: 1, b: 2 }); // { a: 2, b: 4 }
 * mapValues((v, k) => `${k}:${v}`, { a: 1 }); // { a: "a:1" }
 *
 * // asynchronous callback
 * await mapValues(async (v) => v * 2, { a: 1, b: 2 }); // { a: 2, b: 4 }
 *
 * // with pipe
 * pipe(
 *   { a: 1, b: 2 },
 *   mapValues((v) => v * 2),
 * ); // { a: 2, b: 4 }
 * ```
 */
function mapValues<T extends object, B>(
  f: (value: T[keyof T], key: keyof T) => Promise<B>,
  obj: T,
): Promise<{ [K in keyof T]: B }>;

function mapValues<T extends object, B>(
  f: (value: T[keyof T], key: keyof T) => B,
  obj: T,
): { [K in keyof T]: B };

function mapValues<T extends object, B>(
  f: (value: T[keyof T], key: keyof T) => Promise<B>,
): (obj: T) => Promise<{ [K in keyof T]: B }>;

function mapValues<T extends object, B>(
  f: (value: T[keyof T], key: keyof T) => B,
): (obj: T) => { [K in keyof T]: B };

function mapValues<T extends object, B>(
  f: (value: T[keyof T], key: keyof T) => B | Promise<B>,
  obj?: T,
):
  | { [K in keyof T]: B }
  | Promise<{ [K in keyof T]: B }>
  | ((obj: T) => { [K in keyof T]: B } | Promise<{ [K in keyof T]: B }>) {
  if (obj === undefined) {
    return (obj: T) => mapValues(f as (value: T[keyof T]) => B, obj);
  }

  const keys = Object.keys(obj) as (keyof T & string)[];
  const values = keys.map((key) => f(obj[key] as T[keyof T], key));

  if (values.some(isPromise)) {
    return Promise.all(values).then((resolved) => {
      const result = {} as { [K in keyof T]: B };
      keys.forEach((key, i) => (result[key] = resolved[i]));
      return result;
    });
  }

  const result = {} as { [K in keyof T]: B };
  keys.forEach((key, i) => (result[key] = values[i] as B));
  return result;
}

export default mapValues;
