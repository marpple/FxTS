import { capitalizeWord, words } from "./_internal/words";

/**
 * Converts `str` to camel case.
 *
 * Word boundaries are detected from spaces, punctuation, digits, case
 * changes, and acronyms.
 *
 * @example
 * ```ts
 * camelCase("foo bar"); // "fooBar"
 * camelCase("foo-bar"); // "fooBar"
 * camelCase("foo_bar"); // "fooBar"
 * camelCase("FooBar"); // "fooBar"
 * camelCase("XMLHttpRequest"); // "xmlHttpRequest"
 * ```
 */
function camelCase(str: string): string {
  return words(str)
    .map((word, i) => (i === 0 ? word.toLowerCase() : capitalizeWord(word)))
    .join("");
}

export default camelCase;
