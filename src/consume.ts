import { isAsyncIterable, isIterable } from "./_internal/utils";
import range from "./Lazy/range";
import type ReturnValueType from "./types/ReturnValueType";

function sync<T>(iterable: Iterable<T>, n: number) {
  const iterator = iterable[Symbol.iterator]();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _ of range(0, n)) {
    if (iterator.next().done) {
      return;
    }
  }
}

async function async<T>(iterable: AsyncIterable<T>, n: number) {
  const iterator = iterable[Symbol.asyncIterator]();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for await (const _ of range(0, n)) {
    if ((await iterator.next()).done) {
      return;
    }
  }
}

/**
 * Consumes the given number of Iterable/AsyncIterable. If the number is empty, all is consumed.
 *
 * @example
 * ```ts
 * const iterator = (function *(){
 *   yield 1;
 *   yield 2;
 *   yield 3;
 * })();
 * consume(iterator, 2);
 * iterator.next(); // {value:3, done:false}
 * iterator.next(); // {value:undefined, done:true}
 *
 * // with pipe
 * pipe(
 *   range(10),
 *   peek(updateApi),
 *   concurrent(5),
 *   consume,
 * );
 * ```
 */
function consume<
  A extends Iterable<unknown> | AsyncIterable<unknown>,
  B extends number,
>(iterator: A, n?: B): ReturnValueType<A, void>;

function consume<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  iterable: A,
  n = Infinity,
) {
  if (isIterable(iterable)) {
    return sync(iterable, n);
  }

  if (isAsyncIterable(iterable)) {
    return async(iterable, n);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default consume;
