/**
 * Escapes the RegExp special characters `^`, `$`, `\`, `.`, `*`, `+`, `?`,
 * `(`, `)`, `[`, `]`, `{`, `}`, and `|` in `str`, so the result can be used
 * as a literal pattern inside `new RegExp`.
 *
 * @example
 * ```ts
 * escapeRegExp("[fxts](https://fxts.dev/)"); // "\\[fxts\\]\\(https://fxts\\.dev/\\)"
 *
 * const re = new RegExp(escapeRegExp("$1.00"));
 * re.test("price: $1.00"); // true
 * ```
 */
function escapeRegExp(str: string): string {
  return str.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
}

export default escapeRegExp;
