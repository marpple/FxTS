import IterableInfer from "./types/IterableInfer";
import ReturnValueType from "./types/ReturnValueType";
import { UniversalIterable } from "./types/Utils";
import { isAsyncIterable, isIterable } from "./_internal/utils";

function sync<T>(index: number, iterable: Iterable<T>): T | undefined {
  let idx = 0;
  for (const item of iterable) {
    if (idx++ === index) {
      return item;
    }
  }
}

async function async<T>(
  index: number,
  iterable: AsyncIterable<T>,
): Promise<T | undefined> {
  let idx = 0;
  for await (const item of iterable) {
    if (idx++ === index) {
      return item;
    }
  }
}

/**
 * Returns the nth element of the given Iterable/AsyncIterable
 *
 * @example
 * ```ts
 * nth(2, [1,2,3,4]); // 3
 * nth(5, [1,2,3,4]); // undefined
 * nth(2, ['name', 'gender', 'age']); // 'age'
 * nth(3, ['name', 'gender', 'age']); // undefined
 * nth(2, 'abcdefg'); // 'c'
 * nth(10, 'abcdefg'); // undefined
 * ```
 */
// prettier-ignore
function nth(
  index: number, 
  iterable: readonly []
): undefined;

// prettier-ignore
function nth<T>(
  index: number, 
  iterable: Iterable<T>,
): T | undefined;

function nth<T>(
  index: number,
  iterable: AsyncIterable<T>,
): Promise<T | undefined>;

function nth<T extends UniversalIterable<unknown>>(
  index: number,
): (iterable: T) => ReturnValueType<T, IterableInfer<T> | undefined>;

function nth<T extends UniversalIterable<unknown>>(
  index: number,
  iterable?: T,
):
  | undefined
  | IterableInfer<T>
  | Promise<IterableInfer<T> | undefined>
  | ((iterable: T) => ReturnValueType<T, IterableInfer<T> | undefined>) {
  if (iterable === undefined) {
    return (iterable: T) => {
      return nth(index, iterable as any) as ReturnValueType<
        T,
        IterableInfer<T> | undefined
      >;
    };
  }

  if (index < 0) {
    throw new RangeError("'index' must be over 0");
  }

  if (isIterable<IterableInfer<T>>(iterable)) {
    return sync(index, iterable);
  }
  if (isAsyncIterable<IterableInfer<T>>(iterable)) {
    return async(index, iterable);
  }

  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}

export default nth;
