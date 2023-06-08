import identity from "./identity";

/**
 * throw return of `err` if predicate function return true
 *
 * default throw function is {@link https://fxts.dev/docs/identity | identity }
 *
 * if you want to use typeguard, please define generic type like example
 *
 * @example
 * ```ts
 *  pipe(
 *    fn(), // return type is string | undefined
 *
 *    throwIf<string | undefined, undefined>(isUndefined, (err) => Error("return of fn() is undefined")),
 *    // err is undefined, and it is return of fn
 *
 *    (input) => input, // input is string
 *  )
 * ```
 */

function throwIf<T, N extends T>(
  predicate: (input: T) => input is N,
  err?: (input: N) => unknown,
): (input: T) => Exclude<T, N>;

function throwIf<T>(
  predicate: (input: T) => boolean,
  err?: (input: T) => unknown,
): (input: T) => T;

function throwIf<T>(
  predicate: (input: T) => unknown,
  err: (input: unknown) => unknown = identity,
) {
  return (input: T) => {
    if (predicate(input)) throw err(input);
    return input;
  };
}
export default throwIf;
