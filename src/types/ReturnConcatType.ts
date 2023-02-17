import type IterableInfer from "./IterableInfer";

type ReturnConcatType<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B extends Iterable<unknown> | AsyncIterable<unknown>,
> = A extends AsyncIterable<any>
  ? AsyncIterableIterator<IterableInfer<A> | IterableInfer<B>>
  : B extends AsyncIterable<any>
  ? AsyncIterableIterator<IterableInfer<A> | IterableInfer<B>>
  : IterableIterator<IterableInfer<A> | IterableInfer<B>>;

export default ReturnConcatType;
