/**
 * Returns true if the first argument is less than the second; false otherwise.
 *
 * @example
 * ```ts
 * gte(5, 1) // expected false
 * gte(1, 5) // expected true
 * gte("a", "b") // expected true
 * gte("b", "a") // expected false
 *
 * filter(lt(5), [1, 2, 4, 5, 8, 9]) // Iterable<[1, 2, 4]>
 * filter(lt(5), [5, 6, 7]) // Iterable<[]>
 * filter(lt("b"), ["a", "b", "c"]) // Iterable<["a"]>
 * filter(lt("b"), ["b", "c", "d"]) // Itreable<[]>
 * ```
 */
function lt(a: string | number): (b: string | number) => boolean;
function lt(a: string, b: string): boolean;
function lt(a: number, b: number): boolean;

function lt(
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
      return b < a;
    };
  }

  return a < _b;
}

export default lt;
