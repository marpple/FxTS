import curry from "./curry";
import Curry from "./types/Curry";

/**
 * Make sure that it is greater than the reference value.
 * It does not provide a generic type, so we are going to provide curry by default.
 *
 * @example
 * ```ts
 * gt(5, 1) // expected true
 * gt(1, 5) // expected false
 * gt("a", "b") // expected false
 * gt("b", "a") // expected true
 *
 * filter(gt(5), [1, 2, 4, 5, 8, 9]) // Iterable<[8, 9]>
 * filter(gt(5), [1, 2, 3, 4, 5]) // Iterable<[]>
 * filter(gt("b"), ["a", "b", "c"]) // Iterable<["c"]>
 * filter(gt("b"), ["a", "b"]) // Itreable<[]>
 * ```
 */
function gt(a: string): Curry<(b: string) => boolean>;
function gt(a: number): Curry<(b: number) => boolean>;
function gt(a: string, b: string): boolean;
function gt(a: number, b: number): boolean;

function gt(
  a: string | number,
  _b?: string | number,
): Curry<(b: string | number) => boolean> | boolean {
  if (_b === undefined) {
    return curry((c: string | number, b: string | number): boolean => b > c)(a);
  }

  return a > _b;
}

export default gt;
