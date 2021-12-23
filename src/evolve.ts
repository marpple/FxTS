import pipe from "./pipe";
import identity from "./identity";

type Transformation<O extends Record<string, any>> = {
  [K in keyof O]?: (value: O[K]) => any;
};

type EvolveReturnType<
  O extends Record<string, any>,
  T extends Transformation<O>,
> = {
  [K in keyof O]: T[K] extends (value: O[K]) => any ? ReturnType<T[K]> : O[K];
};

/**
 * Creates a new object by recursively evolving a shallow copy of object, according to the transformation functions.
 *
 * @example
 * ```ts
 * const add1String = (a: number) => String(a + 1);
 * const obj = { a: 1, b: 2, c: { d: 3, e: 4 }, f: true };
 * const transformation = {
 *   a: add1String,
 *   b: add1String,
 *   c: (obj: { d: number; e: number }) =>
 *     evolve({ d: add1String, e: add1String }, obj),
 * };
 * evolve(transformation, obj);
 * // { a: "2", b: "3", c: { d: "4", e: "5" }, f: true }
 * ```
 */

function evolve<O extends Record<string, any>, T extends Transformation<O>>(
  transformation: T,
): (obj: O) => EvolveReturnType<O, T>;

function evolve<O extends Record<string, any>, T extends Transformation<O>>(
  transformation: T,
  obj: O,
): EvolveReturnType<O, T>;

function evolve<O extends Record<string, any>, T extends Transformation<O>>(
  transformation: T,
  obj?: O,
): ((obj: O) => EvolveReturnType<O, T>) | EvolveReturnType<O, T> {
  if (obj === undefined) {
    return (obj: O) => evolve(transformation, obj);
  }
  return pipe(
    Object.entries(obj),
    (entries) =>
      entries.map(([k, v]) => [k, (transformation[k] ?? identity)(v)]),
    Object.fromEntries,
  );
}

export default evolve;
