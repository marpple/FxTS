// Splits a string into words: case boundaries ("fooBar"), acronyms
// ("XMLHttpRequest" -> XML, Http, Request), digit runs, and any other
// letter runs (unicode-aware).
// A RegExp constructor call (not a literal) so the es5-targeted esm5 build
// compiles: the "u" flag and \p{...} escapes are ES2018-only syntax in
// regex literals. On runtimes without unicode regex support the string
// case functions throw when called, like the async paths that already
// require Symbol.asyncIterator.
const WORD_PATTERN = new RegExp(
  "\\p{Lu}?\\p{Ll}+|\\p{Lu}+(?!\\p{Ll})|\\p{N}+|\\p{L}+",
  "gu",
);

export const words = (str: string): string[] => str.match(WORD_PATTERN) ?? [];

export const capitalizeWord = (word: string): string =>
  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
