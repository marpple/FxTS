import type Awaited from "./Awaited";
import type IterableInfer from "./IterableInfer";

type ReturnIterableIteratorType<
  T extends Iterable<unknown> | AsyncIterable<unknown>,
  R = IterableInfer<T>,
> = T extends Iterable<unknown>
  ? IterableIterator<R>
  : T extends AsyncIterable<unknown>
  ? AsyncIterableIterator<Awaited<R>>
  : never;

export default ReturnIterableIteratorType;
