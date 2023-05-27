/**
 * throw return of `err` if predicate function return true
 *
 * @example
 * ```ts
 *  pipe(
 *    fn(), // return type is string | undefined
 *
 *    throwIf(isUndefined)((input) => Error("return of fn is undefined")),
 *    // input is undefined, and it is return of fn
 *
 *    (input) => input, // input is string
 *  )
 * ```
 *
 * @param predicate typeguard function for T
 * @return T exclude N
 */
export const throwIf =
  <T, N extends T>(predicate: (input: T) => input is N) =>
  (err: (input: N) => unknown) =>
  (input: T): Exclude<T, N> => {
    if (predicate(input)) {
      throw err(input);
    }
    return input as Exclude<T, N>;
  };

export default throwIf;
