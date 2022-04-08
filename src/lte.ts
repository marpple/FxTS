import curry from "./curry";
import Curry from "./types/Curry";

/**
 * Returns true if the first argument is less or equal than the second; false otherwise.
 *
 * @example
 * ```ts
 * lte(5, 1) // expected false
 * lte(1, 1) // expected true
 * lte(1, 5) // expected true
 * lte("a", "b") // expected true
 * lte("b", "a") // expected false
 *
 * filter(lte(5), [1, 2, 4, 5, 8, 9]) // Iterable<[1, 2, 4, 5]>
 * filter(lte(5), [6, 7, 8]) // Iterable<[]>
 * filter(lte("b"), ["a", "b", "c"]) // Iterable<["a", "b"]>
 * filter(lte("b"), ["c", "d"]) // Itreable<[]>
 * ```
 */
function lte(a: string): Curry<(b: string) => boolean>;
function lte(a: number): Curry<(b: number) => boolean>;
function lte(a: string, b: string): boolean;
function lte(a: number, b: number): boolean;

function lte(
  a: string | number,
  _b?: string | number,
): Curry<(b: string | number) => boolean> | boolean {
  if (_b === undefined) {
    return curry((c: string | number, b: string | number): boolean => b <= c)(
      a,
    );
  }

  return a <= _b;
}

export default lte;
