import zip from "./zip";
import pipe from "../pipe";
import filter from "./filter";
import map from "./map";
import type ReturnIterableIteratorType from "../types/ReturnIterableIteratorType";

/**
 * Returns Iterable/AsyncIterable that filters elements from 'iterable' returning only those that have a corresponding element in 'selectors' that evaluates to 'true'.
 * Stops when either 'iterable' or 'selectors' has been exhausted.
 *
 * @example
 * ```ts
 * const iter1 = compress([false,true,false,false,true],  [1, 2, 3, 4, 5]);
 * iter1.next(); // {value: 2, done:false}
 * iter1.next(); // {value: 5, done:false}
 * iter1.next(); // {value: undefined, done:true }
 *
 * const iter2 = compress([1,0,0,1,0],  "abcde");
 * iter2.next(); // {value: "a", done:false}
 * iter2.next(); // {value: "d", done:false}
 * iter2.next(); // {value: undefined, done:true }
 *
 * // with pipe
 * pipe(
 *   [1, 2, 3],
 *   compress([false, true, true]),
 *   toArray,
 * ); // [2, 3]
 * ```
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toArray | toArray}
 */
function compress<A, B>(
  selector: Array<A>,
  iterable: Iterable<B>,
): IterableIterator<B>;

function compress<A, B>(
  selector: Array<A>,
  iterable: AsyncIterable<B>,
): AsyncIterableIterator<B>;

function compress<A, B extends Iterable<unknown> | AsyncIterable<unknown>>(
  selector: Array<A>,
): (iterable: B) => ReturnIterableIteratorType<B>;

function compress<A, B extends Iterable<unknown> | AsyncIterable<unknown>>(
  selectors: Array<A>,
  iterable?: B,
):
  | ReturnIterableIteratorType<B>
  | ((iterable: B) => ReturnIterableIteratorType<B>) {
  if (iterable === undefined) {
    return (iterable: B) => {
      return compress(
        selectors,
        iterable as any,
      ) as ReturnIterableIteratorType<B>;
    };
  }

  return pipe(
    zip(selectors, iterable),
    filter(([selector]) => selector),
    map(([, value]) => value),
  ) as ReturnIterableIteratorType<B>;
}

export default compress;
