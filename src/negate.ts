/**
 * Create a function that returns the opposite result of a predicate function
 *
 * @example
 * ```ts
 * const isDefined: (input: string | undefined) => input is string = negate(isUndefined)<string | undefined>
 *
 * const isDefined: (input: unknown) => boolean = negate((input) => input === undefined)
 * ```
 */
function negate<T, N extends T>(
  predicate: (input: T) => input is N,
): (input: T) => input is Exclude<T, N>;

function negate<T>(predicate: (input: T) => boolean): (input: T) => boolean;

function negate<T, N>(predicate: (input: T) => unknown) {
  return (input: T): input is Exclude<T, N> => !predicate(input);
}

export default negate;
