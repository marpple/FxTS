import isNil from "./isNil";
import Merge from "./types/Merge";

type MapNonNullableEntries<T extends object> = {
  [K in keyof T]: [K, Exclude<T[K], null | undefined>];
};

type MapRequiredKeys<T extends object> = {
  [K in keyof T]: null extends Extract<T[K], null>
    ? never
    : undefined extends Extract<T[K], undefined>
    ? never
    : K;
};

type MapOptionalKeys<T extends object> = {
  [K in keyof T]: Exclude<T[K], null | undefined> extends never
    ? never
    : T[K] extends Exclude<T[K], null | undefined>
    ? never
    : K;
};

type RequiredKeys<T extends object, U = MapRequiredKeys<T>> = Exclude<
  U[keyof U],
  never
>;

type OptionalKeys<T extends object, U = MapOptionalKeys<T>> = Exclude<
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
): Merge<
  {
    [K in Extract<keyof T, RequiredKeys<T>>]: Extract<
      NonNullableEntries<T>,
      [K, any]
    >[1];
  },
  {
    [K in Extract<keyof T, OptionalKeys<T>>]?: Extract<
      NonNullableEntries<T>,
      [K, any]
    >[1];
  }
> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => !isNil(value)),
  ) as any;
}
