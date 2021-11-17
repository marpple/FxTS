import Awaited from "./Awaited";
import IterableInfer from "./IterableInfer";

type ReturnValueType<
  T extends Iterable<unknown> | AsyncIterable<unknown>,
  R = IterableInfer<T>
> = T extends AsyncIterable<unknown>
  ? Promise<Awaited<R>>
  : T extends Iterable<unknown>
  ? Awaited<R>
  : never;

export default ReturnValueType;
