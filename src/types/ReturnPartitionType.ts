import type { GroupBy } from "./groupBy";
import type IterableInfer from "./IterableInfer";
import type ReturnValueType from "./ReturnValueType";

type ReturnPartitionType<T extends Iterable<unknown> | AsyncIterable<unknown>> =
  ReturnValueType<T, [GroupBy<IterableInfer<T>, "true" | "false">]>;

export default ReturnPartitionType;
