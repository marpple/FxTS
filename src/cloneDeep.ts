const cloneValue = (
  value: unknown,
  seen: WeakMap<object, unknown>,
): unknown => {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (seen.has(value)) {
    return seen.get(value);
  }

  if (value instanceof Date) {
    const out = new Date(value.getTime());
    seen.set(value, out);
    return out;
  }

  if (value instanceof RegExp) {
    const out = new RegExp(value.source, value.flags);
    out.lastIndex = value.lastIndex;
    seen.set(value, out);
    return out;
  }

  if (
    value instanceof WeakMap ||
    value instanceof WeakSet ||
    value instanceof Promise
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    const out: unknown[] = [];
    seen.set(value, out);
    for (let i = 0; i < value.length; i++) {
      out[i] = cloneValue(value[i], seen);
    }
    return out;
  }

  if (value instanceof Map) {
    const out = new Map<unknown, unknown>();
    seen.set(value, out);
    for (const [key, item] of value) {
      out.set(cloneValue(key, seen), cloneValue(item, seen));
    }
    return out;
  }

  if (value instanceof Set) {
    const out = new Set<unknown>();
    seen.set(value, out);
    for (const item of value) {
      out.add(cloneValue(item, seen));
    }
    return out;
  }

  if (value instanceof ArrayBuffer) {
    const out = value.slice(0);
    seen.set(value, out);
    return out;
  }

  if (value instanceof DataView) {
    const out = new DataView(
      value.buffer.slice(0),
      value.byteOffset,
      value.byteLength,
    );
    seen.set(value, out);
    return out;
  }

  if (ArrayBuffer.isView(value)) {
    // TypedArray (including Node's Buffer) - `from` copies into a new instance
    const TypedArrayCtor = value.constructor as unknown as {
      from(v: unknown): unknown;
    };
    const out = TypedArrayCtor.from(value);
    seen.set(value, out as object);
    return out;
  }

  // plain objects, class instances, and Object.create(null)
  const out = Object.create(Object.getPrototypeOf(value));
  seen.set(value, out);
  const keys: (string | symbol)[] = [
    ...Object.keys(value),
    ...Object.getOwnPropertySymbols(value).filter((s) =>
      Object.prototype.propertyIsEnumerable.call(value, s),
    ),
  ];
  for (const key of keys) {
    out[key] = cloneValue(
      (value as Record<string | symbol, unknown>)[key],
      seen,
    );
  }
  return out;
};

/**
 * Creates a deep clone of `value`.
 *
 * Supported types: primitives, Array, plain objects (including
 * `Object.create(null)`), Date, RegExp (`lastIndex` preserved), Map, Set,
 * ArrayBuffer, TypedArray, and DataView. Class instances are cloned with
 * their prototype preserved and own enumerable properties (string and
 * symbol keys) copied. Circular references are supported.
 *
 * Unlike `structuredClone`, functions are kept by reference instead of
 * throwing, and prototypes of class instances are preserved.
 * `WeakMap`/`WeakSet`/`Promise` cannot be cloned and are returned as-is.
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: { c: 2 }, d: [1, 2, 3] };
 * const cloned = cloneDeep(obj);
 * cloned.b === obj.b; // false
 * cloned.d === obj.d; // false
 *
 * // circular references
 * const circular = { a: 1, self: null as unknown };
 * circular.self = circular;
 * const clonedCircular = cloneDeep(circular);
 * clonedCircular.self === clonedCircular; // true
 *
 * // class instances keep their prototype
 * class Point {
 *   constructor(public x: number) {}
 * }
 * cloneDeep(new Point(1)) instanceof Point; // true
 * ```
 */
function cloneDeep<T>(value: T): T {
  return cloneValue(value, new WeakMap()) as T;
}

export default cloneDeep;
