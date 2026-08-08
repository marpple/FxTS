/**
 * Converts the first character of `str` to upper case and the remaining
 * characters to lower case.
 *
 * @example
 * ```ts
 * capitalize("fred"); // "Fred"
 * capitalize("FRED"); // "Fred"
 * capitalize(""); // ""
 * ```
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default capitalize;
