/**
 * Skip the process function if predicate return true.
 *
 * If skipped, return the input data as is, If executed, return the result of the process function
 *
 * If the return type of the process function is void, it will be inferred as returning undefined.
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
