/**
 * Returns the `!` of its argument.
 * It will return `true` when passed falsy value, and `false` when passed a truth value.
 *
 * @example
 * ```ts
 * not(true); // false
 * not(1); // false
 * not(NaN); // true
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-not-37xmk | Try It}
 */
function not(a: unknown): boolean {
  return !a;
}

export default not;
