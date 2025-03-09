import identity from "./identity";
import isUndefined from "./isUndefined";

/**
 * This function returns the second argument (a function or a value) if a given condition is met.
 * If the condition is not met, it simply returns the original input as is.
 *
 * This allows for concise conditional value transformation within a pipeline.
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
 * ) // undefined
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

function when<T>(
  predicate: (input: T) => boolean,
  callback: (input: T) => void,
): (iterator: T) => T;
function when<T>(
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
  if (predicate(iterator)) throw callback(iterator);

  return iterator;
}

export default when;
