import type Key from "./Key";

export type GroupBy<A, B extends Key> = {
  [K in B]: A extends object
    ? {
        [K2 in keyof A]: A[K2] extends B ? K : A[K2];
      }[]
    : K[];
};
