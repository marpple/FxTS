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
function lte(a: string | number): (b: string | number) => boolean;
function lte(a: string, b: string): boolean;
function lte(a: number, b: number): boolean;

function lte(
  a: string | number,
  _b?: string | number,
): ((b: string | number) => boolean) | boolean {
  if (_b === undefined) {
    return (b: string | number): boolean => {
      if (typeof a !== typeof b) {
        throw new TypeError(
          "The values you want to compare must be of the same type",
        );
      }
      return b <= a;
    };
  }

  return a <= _b;
}

export default lte;
