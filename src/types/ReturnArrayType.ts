import type IterableInfer from "./IterableInfer";

type ReturnArrayType<T extends Iterable<unknown> | AsyncIterable<unknown>> =
  T extends Iterable<unknown>
    ? IterableInfer<T>[]
    : T extends AsyncIterable<unknown>
    ? Promise<IterableInfer<T>[]>
    : never;

export default ReturnArrayType;
