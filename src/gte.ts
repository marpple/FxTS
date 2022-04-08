import curry from "./curry";
import Curry from "./types/Curry";

/**
 * Make sure that it is less than the reference value.
 * It does not provide a generic type, so we are going to provide curry by default.
 *
 * @example
 * ```ts
 * filter(gte(5), [1, 2, 4, 5, 8, 9]) // Iterable<[5, 8, 9]>
 * filter(gte(5), [1, 2, 3, 4]) // Iterable<[]>
 * filter(gte("b"), ["a", "b", "c"]) // Iterable<["b", "c"]>
 * filter(gte("b"), ["a"]) // Itreable<[]>
 * ```
 */
function gte(a: string): Curry<(b: string) => boolean>;
function gte(a: number): Curry<(b: number) => boolean>;

function gte(a: string | number): Curry<(b: string | number) => boolean> {
  return curry((c: string | number, b: string | number): boolean => b >= c)(a);
}

export default gte;
