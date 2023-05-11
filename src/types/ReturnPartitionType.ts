import type Awaited from "./Awaited";
import type IterableInfer from "./IterableInfer";
import type ReturnValueType from "./ReturnValueType";

type ReturnPartitionType<T extends Iterable<unknown> | AsyncIterable<unknown>> =
  ReturnValueType<
    T,
    [Awaited<IterableInfer<T>>[], Awaited<IterableInfer<T>>[]]
  >;

export default ReturnPartitionType;
