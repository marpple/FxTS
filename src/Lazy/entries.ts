type Entries<T extends Record<string, any>, K extends keyof T> = K extends any
  ? [K, T[K]]
  : never;

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
