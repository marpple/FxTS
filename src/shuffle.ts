import { isAsyncIterable, isIterable } from "./_internal/utils";
import isArray from "./isArray";
import pipe1 from "./pipe1";
import toArray from "./toArray";
import type IterableInfer from "./types/IterableInfer";
import type ReturnValueType from "./types/ReturnValueType";

/**
 * Returns a new array with the elements of the input array shuffled randomly using Fisher-Yates algorithm.
 *
 * @example
 * ```ts
 * shuffle([1, 2, 3, 4, 5]); // [3, 1, 5, 2, 4] (random order)
 * shuffle("hello"); // ["o", "e", "l", "h", "l"] (random order)
 * ```
 */
// prettier-ignore
function shuffle(
    iterable: readonly []
): any[];

// prettier-ignore
function shuffle<T>(
  iterable: Iterable<T>
): T[];

function shuffle<T>(iterable: AsyncIterable<T>): Promise<T[]>;

function shuffle<T extends Iterable<unknown> | AsyncIterable<unknown>>(): (
  iterable: T,
) => ReturnValueType<T, IterableInfer<T>[]>;

function shuffle<T extends Iterable<unknown> | AsyncIterable<unknown>>(
  iterable?: T,
):
  | IterableInfer<T>[]
  | Promise<IterableInfer<T>[]>
  | ((iterable: T) => ReturnValueType<T, IterableInfer<T>[]>) {
  if (iterable === undefined) {
    return (iterable: T) => {
      return shuffle(iterable as any) as ReturnValueType<T, IterableInfer<T>[]>;
    };
  }

  if (isArray(iterable)) {
    const result = [...(iterable as any[])];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  if (isIterable(iterable)) {
    return pipe1(toArray(iterable as Iterable<IterableInfer<T>>), (arr) => {
      const result = [...arr];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    });
  }

  if (isAsyncIterable(iterable)) {
    return pipe1(
      toArray(iterable as AsyncIterable<IterableInfer<T>>),
      (arr) => {
        const result = [...arr];
        for (let i = result.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
      },
    );
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default shuffle;
