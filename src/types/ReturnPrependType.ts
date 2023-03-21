import type Awaited from "./Awaited";

// prettier-ignore
type ReturnPrependType<A, B extends Iterable<A> | AsyncIterable<Awaited<A>>> =
  [B] extends [Iterable<A>]
    ? IterableIterator<A>
    : [B] extends [AsyncIterable<Awaited<A>>]
    ? AsyncIterableIterator<Awaited<A>>
    : never;

export default ReturnPrependType;
