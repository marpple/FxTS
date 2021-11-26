import IterableInfer from "../types/IterableInfer";
import { isIterable } from "../_internal/utils";

function* sync<A, B>(f: (a: A) => B, iterable: Iterable<A>) {
  for (const a of iterable) {
    if (f(a)) {
      continue;
    }
    yield a;
  }
}

function dropWhile<A, B = unknown>(
  f: (a: A) => B,
  iterable: Iterable<A>,
): IterableIterator<A>;

function dropWhile<A extends Iterable<unknown>, B>(
  f: (a: IterableInfer<A>) => B,
): (iterable: A) => IterableIterator<IterableInfer<A>>;

function dropWhile<A extends Iterable<unknown>, B>(
  f: (a: IterableInfer<A>) => B,
  iterable?: A,
):
  | IterableIterator<IterableInfer<A>>
  | ((iterable: A) => IterableIterator<IterableInfer<A>>) {
  if (iterable === undefined) {
    return (iterable: A) => {
      return dropWhile(f, iterable as Iterable<IterableInfer<A>>);
    };
  }

  if (isIterable(iterable)) {
    return sync(f, iterable as Iterable<IterableInfer<A>>);
  }

  throw new TypeError("iterable must be type of Iterable or AsyncIterable");
}

export default dropWhile;
