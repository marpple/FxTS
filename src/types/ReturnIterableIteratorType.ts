import IterableInfer from "./IterableInfer";
import Awaited from "./Awaited";

type ReturnIterableIteratorType<
  T extends Iterable<unknown> | AsyncIterable<unknown>,
  R = IterableInfer<T>
> = T extends Iterable<unknown>
  ? IterableIterator<R>
  : T extends AsyncIterable<unknown>
  ? AsyncIterableIterator<Awaited<R>>
  : never;

export default ReturnIterableIteratorType;
