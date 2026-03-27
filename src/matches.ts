import every from "./every";
import isMatch from "./isMatch";
import isNil from "./isNil";
import { entries } from "./Lazy";

type DeepPartial<T> = T extends Date | RegExp | Map<any, any> | Set<any>
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;
type Widen<T> = T extends boolean
  ? boolean
  : T extends number
  ? number
  : T extends string
  ? string
  : T;
type DeepWiden<T> = T extends Date | RegExp | Map<any, any> | Set<any>
  ? T
  : T extends Array<infer U>
  ? Array<DeepWiden<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepWiden<U>>
  : T extends object
  ? { [K in keyof T]: DeepWiden<T[K]> }
  : Widen<T>;
type RejectSymbolKeys<T> = T extends Date | RegExp | Map<any, any> | Set<any>
  ? T
  : T extends object
  ? {
      [K in keyof T]: K extends symbol
        ? never
        : T[K] extends object
        ? RejectSymbolKeys<T[K]>
        : T[K];
    }
  : T;

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
 * //      ~~~~
 * //      Error: Argument of type null is not assignable to parameter
 * matcher(undefined); // false
 * //     ~~~~~~~~~~
 * //     Error: Argument of type 'undefined' is not assignable to parameter
 * ```
 *
 * Symbol keys in the pattern are silently ignored at runtime. (which only enumerates string-keyed (and numeric-keyed) properties.)
 *
 * ```ts
 * const sym = Symbol("id");
 * // matches({ [sym]: 123 });
 * //           ~~~~
 * //           Error: Argument of type { [sym]: number } is not assignable to parameter
 *
 * // If bypassed at runtime, the symbol key is ignored:
 * const pattern = { [sym]: 123 } as any;
 * matches(pattern)({}); // true — symbol key was not compared
 * ```
 */
function matches<T>(
  pattern: DeepPartial<T> & RejectSymbolKeys<T>,
): (input: DeepWiden<T>) => boolean;

function matches(
  pattern: Record<string | number, any>,
): (input: any) => boolean {
  return (input) =>
    isNil(input)
      ? false
      : every(([key, value]) => isMatch(input[key], value), entries(pattern));
}

export default matches;
