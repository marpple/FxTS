import reduce from "./reduce";
import { isAsyncIterable, isIterable } from "./_internal/utils";

type ReturnJoinType<T extends Iterable<unknown> | AsyncIterable<unknown>> =
  T extends Iterable<unknown>
    ? string
    : T extends AsyncIterable<unknown>
    ? Promise<string>
    : never;

function sync<A>(sep: string, acc: string, iterable: Iterable<A>) {
  return reduce((a: string, b) => `${a}${sep}${b}`, acc, iterable);
}

function async<A>(sep: string, acc: string, iterable: AsyncIterable<A>) {
  return reduce((a: string, b) => `${a}${sep}${b}`, acc, iterable);
}

/**
 * Returns all elements in the given iterable into a string separated by separator.
 *
 * @example
 * ```ts
 * const joined = join('~', ['a', 'b', 'c']); // 'a~b~c'
 *
 * // with pipe
 * pipe(
 *  [1, 2, 3, 4],
 *  map(a => a + 10),
 *  filter(a => a % 2 === 0)
 *  join('-'),
 * ); // '12-14'
 *
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4]),
 *  join('-'),
 * ); // '1-2-3-4'
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3), Promise.resolve(4)],
 *  toAsync,
 *  join('-'),
 * ); // '1-2-3-4'
 * ```
 */
function join<A extends readonly []>(sep: string, iterable: A): string;

function join<A>(sep: string, iterable: Iterable<A>): string;

function join<A>(sep: string, iterable: AsyncIterable<A>): Promise<string>;

function join<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  sep: string,
): (iterable: A) => ReturnJoinType<A>;

function join<A extends Iterable<unknown> | AsyncIterable<unknown>>(
  sep: string,
  iterable?: A,
): string | Promise<string> | ((iterable: A) => ReturnJoinType<A>) {
  if (iterable === undefined) {
    return (iterable: A): ReturnJoinType<A> => {
      return join(sep, iterable as any) as ReturnJoinType<A>;
    };
  }

  if (isIterable(iterable)) {
    const iterator = iterable[Symbol.iterator]();
    const { done, value } = iterator.next();
    if (done) {
      return "";
    }
    return sync(sep, value, {
      [Symbol.iterator]() {
        return iterator;
      },
    }) as string;
  }

  if (isAsyncIterable(iterable)) {
    const iterator = iterable[Symbol.asyncIterator]();
    return iterator.next().then(({ done, value }) => {
      if (done) {
        return "";
      }
      return async(sep, value, {
        [Symbol.asyncIterator]() {
          return iterator;
        },
      });
    }) as Promise<string>;
  }

  throw new TypeError("iterable must be type of Iterable or AsyncIterable");
}

export default join;
