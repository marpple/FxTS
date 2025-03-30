import isUndefined from "./isUndefined";

/**
 * It returns the original value based on the condition of the first argument or the result of executing the function passed as the second argument.
 *
 * @example
 * ```typescript
 * when(
 *   isNumber,
 *   () => `This is number`
 *   100,
 * ); // This is number
 * ```
 *
 * with pipe
 *
 * ```typescript
 * pipe(
 *   100,
 *   when(
 *     isNumber,
 *     () => `This is number`
 *   )
 * ) // This is number
 *
 * pipe(
 *   100,
 *   when(
 *     isNumber,
 *     (value) => value * 2
 *   )
 * ) // 200
 *
 * pipe(
 *   100,
 *   when(
 *     isString,
 *     () => `This is number` // not work
 *   ),
 * ) // 100
 * ```
 */
function when<T, S extends T, R>(
  predicate: (input: T) => input is S,
  callback: (input: S) => R,
): (a: T) => Exclude<T, S>;
function when<T, R>(
  predicate: (input: T) => boolean,
  callback: (input: T) => R,
): (a: T) => T | R;
function when<T, S extends T, R>(
  predicate: (input: T) => input is S,
  callback: (input: S) => R,
  a: T,
): Exclude<T, S>;
function when<T, R>(
  predicate: (input: T) => boolean,
  callback: (input: T) => R,
  a: T,
): T | R;

function when<T, R>(
  predicate: (input: T) => boolean,
  callback: (input: T) => R,
  a?: T,
) {
  if (isUndefined(a)) {
    return (b: T) => when(predicate, callback, b);
  }
  if (predicate(a)) {
    return callback(a);
  }

  return a;
}

export default when;
