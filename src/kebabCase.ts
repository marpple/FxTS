import { words } from "./_internal/words";

/**
 * Converts `str` to kebab case.
 *
 * Word boundaries are detected from spaces, punctuation, digits, case
 * changes, and acronyms.
 *
 * @example
 * ```ts
 * kebabCase("foo bar"); // "foo-bar"
 * kebabCase("fooBar"); // "foo-bar"
 * kebabCase("foo_bar"); // "foo-bar"
 * kebabCase("XMLHttpRequest"); // "xml-http-request"
 * ```
 */
function kebabCase(str: string): string {
  return words(str)
    .map((word) => word.toLowerCase())
    .join("-");
}

export default kebabCase;
