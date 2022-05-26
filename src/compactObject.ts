import isNil from "./isNil";

type NullToUndefined<T> = T extends Exclude<T, null>
  ? T
  : Exclude<T, null> | undefined;

type MapNonNullableEntries<T extends object> = {
  [K in keyof T]: [K, NullToUndefined<T[K]>];
};

type MapNonNullableKeys<T extends object> = {
  [K in keyof T]: NonNullable<T[K]> extends never ? never : K;
};

type NonNullableKeys<T extends object, U = MapNonNullableKeys<T>> = Exclude<
  U[keyof U],
  never
>;

type NonNullableEntries<
  T extends object,
  U = MapNonNullableEntries<T>,
> = Exclude<U[keyof U], [any, never]>;

/**
 * Returns an object with all nullable values removed.
 *
 * @example
 * ```ts
 * const compacted = compactObject({ a: 1, b: "b", c: null, d: undefined });
 * // {a: 1, b: "b"}
 * ```
 */
export default function compactObject<T extends object>(
  obj: T,
): {
  [K in Extract<keyof T, NonNullableKeys<T>>]: Extract<
    NonNullableEntries<T>,
    [K, any]
  >[1];
} {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => !isNil(value)),
  ) as any;
}
