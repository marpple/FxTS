/**
 * Returns true if the first argument is greater than the second; false otherwise.
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

function gt(a: string | number | Date): (b: string | number | Date) => boolean;
function gt(a: string, b: string): boolean;
function gt(a: number, b: number): boolean;
function gt(a: Date, b: Date): boolean;

function gt(
  a: string | number | Date,
  _b?: string | number | Date,
): ((b: string | number | Date) => boolean) | boolean {
  if (_b !== undefined) {
    return a > _b;
  }

  return (b: string | number | Date): boolean => {
    if (typeof a !== typeof b) {
      throw new TypeError(
        "The values you want to compare must be of the same type",
      );
    }
    return b > a;
  };
}

export default gt;
