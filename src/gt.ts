import curry from "./curry";
import Curry from "./types/Curry";

/**
 * Make sure that it is less than the reference value.
 * It does not provide a generic type, so we are going to provide curry by default.
 *
 * @example
 * ```ts
 * filter(gt(5), [1, 2, 4, 5, 8, 9]) // Iterable<[8, 9]>
 * filter(gt(5), [1, 2, 3, 4, 5]) // Iterable<[]>
 * filter(gt("b"), ["a", "b", "c"]) // Iterable<["c"]>
 * filter(gt("b"), ["a", "b"]) // Itreable<[]>
 * ```
 */
function gt(a: string): Curry<(b: string) => boolean>;
function gt(a: number): Curry<(b: number) => boolean>;

function gt(a: string | number): Curry<(b: string | number) => boolean> {
  return curry((c: string | number, b: string | number): boolean => b > c)(a);
}

export default gt;
