type Nullable<T> = T extends null | undefined ? T : never;

/**
 * Checks if the given value is `null` or `undefined`.
 *
 * @example
 * ```ts
 * isNil(1); // false
 * isNil('1'); // false
 * isNil(undefined); // true
 * isNil(null); // true
 * ```
 */
function isNil<T>(a: T): a is Nullable<T> {
  if (a === undefined || a === null) {
    return true;
  }

  return false;
}

export default isNil;
