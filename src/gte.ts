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
 * filter(gte(5), [1, 2, 4, 5, 8, 9]) // Iterable<[1, 2, 4, 5]>
 * filter(gte(1), [2, 3, 4]) // Iterable<[]>
 * filter(gte("b"), ["a", "b", "c"]) // Iterable<["a", "b"]>
 * filter(gte("a"), ["b"]) // Itreable<[]>
 * ```
 */
function gte(a: string): (b: string) => boolean;
function gte(a: number): (b: number) => boolean;
function gte(a: Date): (b: Date) => boolean;
function gte(a: string, b: string): boolean;
function gte(a: number, b: number): boolean;
function gte(a: Date, b: Date): boolean;

function gte(a: any, b?: any): ((b: any) => boolean) | boolean {
  if (b === undefined) {
    return (_b: any) => gte(a, _b);
  }

  if (a.constructor !== b.constructor) {
    throw new TypeError(
      "The values you want to compare must be of the same type",
    );
  }

  return a >= b;
}

export default gte;
