import isUndefined from "./isUndefined";

/**
 * It returns the original value based on the condition of the first argument or the result of executing the function passed as the second argument.
 *
 * @example
 * ```ts
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
 */

function when<T, S extends T, R>(
  predicate: (input: T) => input is S,
  callback: (input: S) => R,
): (
  iterator: T,
) => ReturnType<typeof predicate> extends true ? R : Exclude<T, S>;
function when<T, S extends T, R>(
  predicate: (input: T) => input is S,
  callback: (input: S) => R,
  iterator: T,
): ReturnType<typeof predicate> extends true ? R : Exclude<T, S>;

function when<T, S extends T, R>(
  predicate: (input: T) => input is S,
  callback: (input: S) => R,
  iterator?: T,
) {
  if (isUndefined(iterator))
    return (currentIterator: T) => when(predicate, callback, currentIterator);
  if (predicate(iterator)) return callback(iterator);

  return iterator;
}

export default when;
