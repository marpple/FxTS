import type Cast from "./Cast";

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type LastOf<T> = UnionToIntersection<
  T extends any ? () => T : never
> extends () => infer R
  ? R
  : never;

type Push<T extends any[], V> = [...T, V];

export type TuplifyUnion<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false,
> = true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>;
// https://stackoverflow.com/questions/55127004/how-to-transform-union-type-to-tuple-type/55128956#55128956

type Not<T extends boolean> = T extends true ? false : true;

type Equals<A, B> = A extends B ? (B extends A ? true : false) : false;

type ExcludeEach<A extends object, B extends A> = {
  [key in keyof A]: B[key] extends boolean
    ? Equals<B[key], boolean> extends false
      ? Not<Cast<B[key], boolean>>
      : Exclude<A[key], B[key]>
    : Exclude<A[key], B[key]>;
};

type CompactKeys<T extends object> = Exclude<
  {
    [key in keyof T]: T[key] extends never ? never : key;
  }[keyof T],
  never
>;

export type ExcludeObject<
  A extends object,
  B extends A,
  C = ExcludeEach<A, B>,
  D = {
    [key in keyof A]: Cast<C, A>[key] extends never ? A[key] : Cast<C, A>[key];
  },
> = Equals<Exclude<A, B> | B, A> extends true
  ? Exclude<A, B>
  : TuplifyUnion<CompactKeys<Cast<C, object>>>["length"] extends 1
  ? D
  : A;
