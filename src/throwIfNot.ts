import identity from "./identity";

/**
 * throw return of `err` if predicate function return false
 *
 * default throw function is {@link https://fxts.dev/docs/identity | identity }
 *
 * @example
 * ```ts
 *  pipe(
 *    fn(), // return type is string | undefined
 *
 *    throwIfNot(isUndefined, (err) => Error("return of fn() is not undefined")),
 *    // err is string, and it is return of fn
 *
 *    (input) => input, // input is undefined
 *  )
 * ```
 */
function throwIfNot<T, N extends T>(
  predicate: (input: T) => input is N,
  err?: (input: Exclude<T, N>) => unknown,
): (input: T) => N;

function throwIfNot<T>(
  predicate: (input: T) => boolean,
  err?: (input: T) => unknown,
): (input: T) => T;

function throwIfNot<T>(
  predicate: (input: T) => boolean,
  err: (input: Exclude<unknown, T>) => unknown = identity,
) {
  return (input: T) => {
    if (!predicate(input)) throw err(input as any);
    return input;
  };
}

export default throwIfNot;
