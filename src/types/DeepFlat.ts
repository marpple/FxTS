import Sub from "./Sub";

type DeepFlat<A, B extends number = 0> = A extends
  | Iterable<infer U>
  | AsyncIterable<infer U>
  ? B extends 0
    ? A
    : DeepFlat<U, Sub<B, 1>>
  : A;

type DeepFlatSync<A, B extends number = 0> = A extends Iterable<infer U>
  ? B extends 0
    ? A
    : DeepFlat<U, Sub<B, 1>>
  : A;

export { type DeepFlat, type DeepFlatSync };
