import type IterableInfer from "./IterableInfer";
import type ReturnValueType from "./ReturnValueType";
import type { GroupBy } from "./groupBy";

type ReturnPartitionType<T extends Iterable<unknown> | AsyncIterable<unknown>> =
  ReturnValueType<
    T,
    [
      Awaited<GroupBy<IterableInfer<T>, "true" | "false">["true"]>,
      Awaited<GroupBy<IterableInfer<T>, "true" | "false">["false"]>,
    ]
  >;

export default ReturnPartitionType;
