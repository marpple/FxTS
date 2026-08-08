// Splits a string into words: case boundaries ("fooBar"), acronyms
// ("XMLHttpRequest" -> XML, Http, Request), digit runs, and any other
// letter runs (unicode-aware).
const WORD_PATTERN = /\p{Lu}?\p{Ll}+|\p{Lu}+(?!\p{Ll})|\p{N}+|\p{L}+/gu;

export const words = (str: string): string[] => str.match(WORD_PATTERN) ?? [];

export const capitalizeWord = (word: string): string =>
  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
