/**
 * Returns true if the first argument is less than the second; false otherwise.
 *
 * @example
 * ```ts
 * lte(5, 1) // expected false
 * lte(1, 5) // expected true
 * lte("a", "b") // expected true
 * lte("b", "a") // expected false
 *
 * filter(lt(5), [1, 2, 4, 5, 8, 9]) // Iterable<[1, 2, 4]>
 * filter(lt(5), [5, 6, 7]) // Iterable<[]>
 * filter(lt("b"), ["a", "b", "c"]) // Iterable<["a"]>
 * filter(lt("b"), ["b", "c", "d"]) // Itreable<[]>
 * ```
 */
function lt(a: string): (b: string) => boolean;
function lt(a: number): (b: number) => boolean;
function lt(a: Date): (b: Date) => boolean;
function lt(a: string, b: string): boolean;
function lt(a: number, b: number): boolean;
function lt(a: Date, b: Date): boolean;

function lt(a: any, b?: any): ((b: any) => boolean) | boolean {
  if (b === undefined) {
    return (_b: any) => lt(_b, a);
  }

  if (a.constructor !== b.constructor) {
    throw new TypeError(
      "The values you want to compare must be of the same type",
    );
  }

  return a < b;
}

export default lt;
