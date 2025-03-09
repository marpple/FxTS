import identity from "./identity";
import isUndefined from "./isUndefined";
import pipe from "./pipe";
import throwIf from "./throwIf";

/**
 * This function executes the second argument function based on the condition of the first argument.
 * If the executed function returns a value, that value is returned. If there is no return value, the pipeLine terminates.
 *
 * @example
 * ```ts
 * pipe(
 *   [1, 2, 3, 4],
 *   when(
 *     (list) => pipe(list, sum) >= 10,
 *     (list) => {
 *       console.log(list) // [1, 2, 3, 4]
 *     }
 *   ),
 * ) // throw undefined
 *
 * pipe(
 *   [1, 2, 3, 4],
 *   when(
 *     (list) => pipe(list, sum) >= 10,
 *     (list) => list
 *   ),
 *   sum
 * ) // 10
 *
 * pipe(
 *   [1, 2, 3],
 *   when(
 *     (list) => pipe(list, sum) >= 10,
 *     (list) => {
 *       // Not work..
 *     }
 *   ),
 * ) // [1, 2, 3]
 */

function when<T, R = any>(
  predicate: (input: T) => boolean,
  callback: (input: T) => void,
): (iterator: T) => T;
function when<T, R = any>(
  predicate: (input: T) => boolean,
  callback: (input: T) => void,
  iterator: T,
): T;

function when<T>(
  predicate: (input: T) => boolean,
  callback: (input: T) => void = identity,
  iterator?: T,
) {
  if (isUndefined(iterator))
    return (currentIterator: T) => when(predicate, callback, currentIterator);
  if (predicate(iterator)) {
    return pipe(
      callback(iterator),
      throwIf(isUndefined, () => undefined),
    );
  }

  return iterator;
}

export default when;
