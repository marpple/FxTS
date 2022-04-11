/**
 * Returns true if the first argument is greater or equal than the second; false otherwise.
 *
 * @example
 * ```ts
 * gte(5, 1) // expected true
 * gte(1, 1) // expected true
 * gte(1, 5) // expected false
 * gte("a", "b") // expected false
 * gte("b", "a") // expected true
 *
 * filter(gte(5), [1, 2, 4, 5, 8, 9]) // Iterable<[5, 8, 9]>
 * filter(gte(5), [1, 2, 3, 4]) // Iterable<[]>
 * filter(gte("b"), ["a", "b", "c"]) // Iterable<["b", "c"]>
 * filter(gte("b"), ["a"]) // Itreable<[]>
 * ```
 */
function gte(a: string | number | Date): (b: string | number | Date) => boolean;
function gte(a: string, b: string): boolean;
function gte(a: number, b: number): boolean;
function gte(a: Date, b: Date): boolean;

function gte(
  a: string | number | Date,
  _b?: string | number | Date,
): ((b: string | number | Date) => boolean) | boolean {
  if (_b !== undefined) {
    return a >= _b;
  }

  return (b: string | number | Date): boolean => {
    if (typeof a !== typeof b) {
      throw new TypeError(
        "The values you want to compare must be of the same type",
      );
    }
    return b >= a;
  };
}

export default gte;
