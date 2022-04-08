import curry from "./curry";
import Curry from "./types/Curry";

/**
 * Make sure that it is less than the reference value.
 * It does not provide a generic type, so we are going to provide curry by default.
 *
 * @example
 * ```ts
 * filter(lte(5), [1, 2, 4, 5, 8, 9]) // Iterable<[1, 2, 4, 5]>
 * filter(lte(5), [6, 7, 8]) // Iterable<[]>
 * filter(lte("b"), ["a", "b", "c"]) // Iterable<["a", "b"]>
 * filter(lte("b"), ["c", "d"]) // Itreable<[]>
 * ```
 */
function lte(a: string): Curry<(b: string) => boolean>;
function lte(a: number): Curry<(b: number) => boolean>;

function lte(a: string | number): Curry<(b: string | number) => boolean> {
  return curry((c: string | number, b: string | number): boolean => b <= c)(a);
}

export default lte;
