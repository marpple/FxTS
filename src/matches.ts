import every from "./every";
import isMatch from "./isMatch";
import isNil from "./isNil";
import { entries } from "./Lazy";
import type Key from "./types/Key";

/**
 * Creates a predicate function that checks if an input matches all properties in the given pattern.
 *
 * Performs deep comparison for nested objects and arrays.
 * Useful for replacing callback functions with object patterns in `find`, `filter`, `some`, `every`.
 *
 * @example
 * ```ts
 * const users = [
 *   { name: "John", age: 30, active: true },
 *   { name: "Jane", age: 25, active: false },
 *   { name: "Bob", age: 30, active: true },
 * ];
 *
 * // Use with filter
 * filter(matches({ age: 30, active: true }), users);
 * // [{ name: "John", age: 30, active: true }, { name: "Bob", age: 30, active: true }]
 *
 * // Use with find
 * find(matches({ active: true }), users);
 * // { name: "John", age: 30, active: true }
 *
 * // Use with pipe
 * pipe(users, filter(matches({ active: true })), toArray);
 * // [{ name: "John", age: 30, active: true }, { name: "Bob", age: 30, active: true }]
 *
 * // Deep matching with nested objects
 * const data = [
 *   { id: 1, user: { profile: { age: 30 } } },
 *   { id: 2, user: { profile: { age: 25 } } },
 *   { id: 3, user: { profile: { age: 30 } } },
 * ];
 * filter(matches({ user: { profile: { age: 30 } } }), data);
 * // [{ id: 1, user: { profile: { age: 30 } } }, { id: 3, user: { profile: { age: 30 } } }]
 *
 * // Array value matching
 * const items = [
 *   { id: 1, tags: ["a", "b"] },
 *   { id: 2, tags: ["c", "d"] },
 *   { id: 3, tags: ["a", "b"] },
 * ];
 * filter(matches({ tags: ["a", "b"] }), items);
 * // [{ id: 1, tags: ["a", "b"] }, { id: 3, tags: ["a", "b"] }]
 *
 * // Returns false for null/undefined input
 * const matcher = matches({ a: 1 });
 * matcher(null);      // false
 * matcher(undefined); // false
 * ```
 */
function matches<T>(pattern: Record<Key, any>): (input: T) => boolean;

function matches<T>(pattern: Record<keyof T, any>): (input: T) => boolean {
  return (input: T): boolean =>
    isNil(input)
      ? false
      : every(
          ([key, value]) => isMatch(input[key as keyof T], value),
          entries(pattern),
        );
}

export default matches;
