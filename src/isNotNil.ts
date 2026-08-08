import isNil from "./isNil";

/**
 * Checks if the given value is not `null` or `undefined`.
 *
 * The opposite of `isNil`. As a type guard it narrows `T | null | undefined`
 * to `NonNullable<T>`, which makes it useful with `filter`.
 *
 * @example
 * ```ts
 * isNotNil(1); // true
 * isNotNil("1"); // true
 * isNotNil(undefined); // false
 * isNotNil(null); // false
 *
 * // with filter
 * pipe(
 *   [1, null, 2, undefined, 3],
 *   filter(isNotNil),
 *   toArray,
 * ); // [1, 2, 3] - narrowed to number[]
 * ```
 */
const isNotNil = <T>(input: T): input is NonNullable<T> => !isNil(input);

export default isNotNil;
