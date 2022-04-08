import curry from "./curry";
import Curry from "./types/Curry";

/**
 * Make sure that it is less than the reference value.
 * It does not provide a generic type, so we are going to provide curry by default.
 *
 * @example
 * ```ts
 * filter(lt(5), [1, 2, 4, 5, 8, 9]) // Iterable<[1, 2, 4]>
 * filter(lt(5), [5, 6, 7]) // Iterable<[]>
 * filter(lt("b"), ["a", "b", "c"]) // Iterable<["a"]>
 * filter(lt("b"), ["b", "c", "d"]) // Itreable<[]>
 * ```
 */
function lt(a: string): Curry<(b: string) => boolean>;
function lt(a: number): Curry<(b: number) => boolean>;

function lt(a: string | number): Curry<(b: string | number) => boolean> {
  return curry((c: string | number, b: string | number): boolean => b < c)(a);
}

export default lt;
