import Awaited from "./Awaited";
import IterableInfer from "./IterableInfer";
import ReturnValueType from "./ReturnValueType";

type ReturnPartitionType<T extends Iterable<unknown> | AsyncIterable<unknown>> =
  ReturnValueType<
    T,
    [Awaited<IterableInfer<T>>[], Awaited<IterableInfer<T>>[]]
  >;

export default ReturnPartitionType;
