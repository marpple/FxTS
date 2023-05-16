import type { TuplifyUnion } from "./ExcludeObject";

type IsSubtype<A, B> = A extends B ? (B extends A ? false : true) : false;

type IsUnionKey<T> = IsSubtype<T, string> extends true
  ? true
  : IsSubtype<T, number> extends true
  ? true
  : IsSubtype<T, symbol> extends true
  ? true
  : false;

export type GetKeyOf<
  T extends object,
  V extends T[keyof T],
  R = Exclude<
    {
      [K in keyof T]: V extends T[K]
        ? IsUnionKey<T[K]> extends true
          ? K
          : never
        : never;
    }[keyof T],
    never
  >,
> = TuplifyUnion<R>["length"] extends 1 ? R : never;

/*
 * type Test = GetKeyOf<{a: 1, b: 2}, 1> // a
 */
