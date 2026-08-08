import { words } from "./_internal/words";

/**
 * Converts `str` to snake case.
 *
 * Word boundaries are detected from spaces, punctuation, digits, case
 * changes, and acronyms.
 *
 * @example
 * ```ts
 * snakeCase("foo bar"); // "foo_bar"
 * snakeCase("fooBar"); // "foo_bar"
 * snakeCase("foo-bar"); // "foo_bar"
 * snakeCase("XMLHttpRequest"); // "xml_http_request"
 * ```
 */
function snakeCase(str: string): string {
  return words(str)
    .map((word) => word.toLowerCase())
    .join("_");
}

export default snakeCase;
