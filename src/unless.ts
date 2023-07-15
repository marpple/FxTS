/**
 *
 * If the result of `predicate` is true, `process` will not be executed.
 * `unless` return the result of `process` if it is executed,
 *  and if the `process` is not executed, it returns the function argument as is.
 *
 * @example
 * ```ts
 * // it will return only string
 * const unlessIsString: (input: string | undefined) => string = unless(isString, (input) => {
 *    throw Error("input is undefiend.")
 * });
 * ```
 *
 * @param predicate determines whether to execute `process`
 * @return original input or result of `process`
 */
function unless<T, N extends T, U>(
  predicate: (input: T) => input is N,
  process: (input: Exclude<T, N>) => U,
): (input: T) => N | (U extends void ? undefined : U);

function unless<T, U>(
  predicate: (input: T) => boolean,
  process: (input: T) => U,
): (input: T) => T | (U extends void ? undefined : U);

function unless(predicate: any, process: any) {
  return (input: any) => (predicate(input) ? input : process(input));
}

export default unless;
