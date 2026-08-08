import isPlainObject from "./isPlainObject";

// Deep-copies plain objects/arrays so the result never shares references
// with the inputs; any other value is kept as-is.
const copy = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(copy);
  }
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value)) {
      if (key === "__proto__") continue;
      out[key] = copy(value[key]);
    }
    return out;
  }
  return value;
};

const hasOwn = (obj: object, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(obj, key);

const mergeValues = (a: unknown, b: unknown): unknown => {
  if (Array.isArray(a) && Array.isArray(b)) {
    const result: unknown[] = [];
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      if (i >= b.length || (b[i] === undefined && i < a.length)) {
        result[i] = copy(a[i]);
      } else if (i < a.length) {
        result[i] = mergeValues(a[i], b[i]);
      } else {
        result[i] = copy(b[i]);
      }
    }
    return result;
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    const result: Record<string, unknown> = {};
    // Insert target keys first to preserve their order; merged values are
    // filled in by the source loop below.
    for (const key of Object.keys(a)) {
      if (key === "__proto__") continue;
      result[key] = hasOwn(b, key) ? undefined : copy(a[key]);
    }
    for (const key of Object.keys(b)) {
      if (key === "__proto__") continue;
      const value = b[key];
      if (hasOwn(a, key)) {
        result[key] =
          value === undefined ? copy(a[key]) : mergeValues(a[key], value);
      } else {
        result[key] = copy(value);
      }
    }
    return result;
  }

  return copy(b);
};

/**
 * Recursively merges `source` into `target` and returns a new object.
 * Neither input is modified.
 *
 * - Plain objects are merged recursively; `source` properties win.
 * - Arrays are merged index by index (`[1, 2, 3]` merged with `[9]` is `[9, 2, 3]`).
 * - `undefined` in `source` does not overwrite an existing `target` value.
 * - Any other value (Date, Map, Set, class instances, ...) replaces the
 *   `target` value as-is, and when the two sides are different kinds of
 *   containers, `source` replaces `target`.
 * - `__proto__` keys are skipped, so merging untrusted input cannot pollute
 *   the prototype chain.
 * - Circular structures are not supported.
 *
 * @example
 * ```ts
 * merge({ a: 1, b: { c: 2 } }, { b: { d: 3 } }); // { a: 1, b: { c: 2, d: 3 } }
 * merge({ a: [1, 2, 3] }, { a: [9] }); // { a: [9, 2, 3] }
 * merge({ a: 1 }, { a: undefined }); // { a: 1 }
 *
 * // with pipe - the piped object wins over the given defaults
 * pipe(
 *   { port: 3000 },
 *   merge({ host: "localhost", port: 80 }),
 * ); // { host: "localhost", port: 3000 }
 * ```
 */
function merge<T extends object, S extends object>(target: T, source: S): T & S;
function merge<T extends object>(
  target: T,
): <S extends object>(source: S) => T & S;

function merge<T extends object, S extends object>(target: T, source?: S) {
  if (source === undefined) {
    return (s: S): T & S => merge(target, s);
  }
  return mergeValues(target, source) as T & S;
}

export default merge;
