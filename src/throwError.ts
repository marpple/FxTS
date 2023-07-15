/**
 * throw result of `toError`
 *
 * @example
 * ```ts
 * const result: never = pipe(
 *   0,
 *
 *   throwError((input) => Error(`input is ${input}`)),
 *
 *   (input: never) => {
 *     // unreachable point
 *   },
 * );
 * ```
 */
const throwError =
  <T, E extends Error>(toError: (input: T) => E) =>
  (input: T) => {
    throw toError(input);
  };

export default throwError;
