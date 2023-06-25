/**
 * Skip the process function if predicate return true.
 *
 * If skipped, return the input data as is, If executed, return the result of the process function
 *
 * @example
 * ```ts
 * const isString = (input: string | undefined): input is string =>
 *   typeof input === "string";
 *
 * const skipIfString: (input: string | undefined) => string = skip(isString)((input) => {
 *   // input type is undefined
 *   throw Error("input is undefined");
 * });
 * ```
 *
 * @param predicate determines whether to skip or include the process function
 * @return original input or result of process function
 */
function skip<T, N extends T>(
  predicate: (input: T) => input is N,
): <U>(process: (input: Exclude<T, N>) => U) => (input: T) => N | U;

function skip<T>(
  predicate: (input: T) => boolean,
): <N>(process: (input: T) => N) => (input: T) => T | N;

function skip<T>(predicate: (input: T) => boolean) {
  return <N>(process: (input: T) => N) =>
    (input: T) =>
      predicate(input) ? input : process(input);
}

export default skip;
