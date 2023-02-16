import isNumber from "./isNumber";
import isString from "./isString";
import type Awaited from "./types/Awaited";
import { isPromise } from "./_internal/utils";

// prettier-ignore
type ReturnAddType<T, A extends T, B extends T> = 
  | [A] extends [Promise<Awaited<T>>]
  ? Promise<Awaited<T>>
  : [B] extends [Promise<Awaited<T>>]
  ? Promise<Awaited<T>>
  : Awaited<T>;

function sync(a: number | string, b: number | string) {
  if (isNumber(a) && isNumber(b)) {
    return a + b;
  }

  if (isString(a) && isString(b)) {
    return a + b;
  }

  throw new TypeError("'a' or 'b' must be type of number or string");
}

async function async(a: Promise<number | string>, b: Promise<number | string>) {
  return sync(await a, await b);
}

/**
 * Adds two values.
 *
 * @example
 * ```ts
 * add(1, 2); // 3
 * await add(1, Promise.resolve(2)); // 3
 * await add(Promise.resolve(1), 2); // 3
 * await add(Promise.resolve(1), Promise.resolve(2)); // 3
 *
 * add('a', 'b'); // 'ab'
 * await add('a', Promise.resolve('b')); // 'ab'
 * await add(Promise.resolve('a'), 'b'); // 'ab'
 * await add(Promise.resolve('a'), Promise.resolve('b')); // 'ab'
 * ```
 */
function add<
  A extends number | Promise<number>,
  B extends number | Promise<number>,
>(a: A, b: B): ReturnAddType<number | Promise<number>, A, B>;
function add<
  A extends string | Promise<string>,
  B extends string | Promise<string>,
>(a: A, b: B): ReturnAddType<string | Promise<string>, A, B>;

function add<
  A extends number | Promise<number>,
  B extends number | Promise<number>,
>(a: A): (b: B) => ReturnAddType<number | Promise<number>, A, B>;

function add<
  A extends string | Promise<string>,
  B extends string | Promise<string>,
>(a: A): (b: B) => ReturnAddType<string | Promise<string>, A, B>;

function add<
  A extends string | number | Promise<string | number>,
  B extends string | number | Promise<string | number>,
>(a: A, b?: B): number | string | Promise<string | number> | ((b: B) => any) {
  if (b === undefined) {
    return (b: B) => {
      return add(a as any, b as any);
    };
  }

  if (isPromise(a) || isPromise(b)) {
    return async(Promise.resolve(a), Promise.resolve(b));
  }

  return sync(a, b);
}

export default add;
