import chunk from "./Lazy/chunk";

type Predicate<T> = (value: T) => boolean;
type Refinement<T, T1 extends T> = (value: T) => value is T1;
type Mapper<T, R> = (value: T) => R;
type MapperByRefinement<Pred, R> = Pred extends (value: infer T) => boolean
  ? Pred extends Refinement<T, infer T1>
    ? Mapper<T1, R>
    : Mapper<T, R>
  : never;
type Thrower<T> = (error: T) => never;
type DefaultFn<T, R> = Mapper<T, R> | Thrower<T>;
type EvenArray = unknown[] & { length: 0 | 2 | 4 | 6 | 8 | 10 | 12 };

/**
 * Returns a mapped value based on the first matching predicate.
 * The predicates can return boolean or be type refinements.
 *
 * If the predicate is a type refinement, the corresponding mapper will receive the narrowed type.
 * Else, the mapper will receive the original type.
 * If there's no match, the input value is returned as is. (if the number of functions is even)
 * Or the `default` function (the last function without paired predicate) is executed if provided.
 * (if the number of functions is odd)
 *
 * @example
 * ```ts
 * pipe(
 *   [10, 20, 30],
 *   map(cases(
 *     lt(15), (n) => n + 20,
 *     lt(25), (n) => n + 10,
 *   )),
 *   toArray,
 * ) // [30, 30, 30]
 * ```
 *
 * @example
 * with type refinement
 *
 * ```ts
 * type A = { a: string; }
 * type B = A & { b: string; }
 *
 * pipe(
 *   [{ a: "A", b: "B" }, { a: "A" }] as A[],
 *   map(cases(
 *    (n): n is B => "b" in n, (n) => n.b,
 *    (n) => n.a,
 *   )),
 *  toArray,
 * ) // ["B", "A"]
 * ```
 */
function cases(): (value: unknown) => typeof value;
function cases<T, R>(defaultFn: DefaultFn<T, R>): (value: T) => R;
function cases<T, P1 extends Predicate<T> | Refinement<T, T>, R>(
  pred1: P1,
  mapper1: MapperByRefinement<typeof pred1, R>,
): (value: T) => T | R;
function cases<T, P1 extends Predicate<T> | Refinement<T, T>, R>(
  pred1: P1,
  mapper1: MapperByRefinement<typeof pred1, R>,
  defaultFn: DefaultFn<T, R>,
): (value: T) => R;
function cases<
  T,
  P1 extends Predicate<T> | Refinement<T, T>,
  P2 extends Predicate<T> | Refinement<T, T>,
  R,
>(
  pred1: P1,
  mapper1: MapperByRefinement<typeof pred1, R>,
  pred2: P2,
  mapper2: MapperByRefinement<typeof pred2, R>,
): (value: T) => T | R;
function cases<
  T,
  P1 extends Predicate<T> | Refinement<T, T>,
  P2 extends Predicate<T> | Refinement<T, T>,
  R,
>(
  pred1: P1,
  mapper1: MapperByRefinement<typeof pred1, R>,
  pred2: P2,
  mapper2: MapperByRefinement<typeof pred2, R>,
  defaultFn: DefaultFn<T, R>,
): (value: T) => R;
function cases<
  T,
  P1 extends Predicate<T> | Refinement<T, T>,
  P2 extends Predicate<T> | Refinement<T, T>,
  P3 extends Predicate<T> | Refinement<T, T>,
  R,
>(
  pred1: P1,
  mapper1: MapperByRefinement<typeof pred1, R>,
  pred2: P2,
  mapper2: MapperByRefinement<typeof pred2, R>,
  pred3: P3,
  mapper3: MapperByRefinement<typeof pred3, R>,
): (value: T) => T | R;
function cases<
  T,
  P1 extends Predicate<T> | Refinement<T, T>,
  P2 extends Predicate<T> | Refinement<T, T>,
  P3 extends Predicate<T> | Refinement<T, T>,
  R,
>(
  pred1: P1,
  mapper1: MapperByRefinement<typeof pred1, R>,
  pred2: P2,
  mapper2: MapperByRefinement<typeof pred2, R>,
  pred3: P3,
  mapper3: MapperByRefinement<typeof pred3, R>,
  defaultFn: DefaultFn<T, R>,
): (value: T) => R;
function cases<
  T,
  P1 extends Predicate<T> | Refinement<T, T>,
  P2 extends Predicate<T> | Refinement<T, T>,
  P3 extends Predicate<T> | Refinement<T, T>,
  P4 extends Predicate<T> | Refinement<T, T>,
  R,
>(
  pred1: P1,
  mapper1: MapperByRefinement<typeof pred1, R>,
  pred2: P2,
  mapper2: MapperByRefinement<typeof pred2, R>,
  pred3: P3,
  mapper3: MapperByRefinement<typeof pred3, R>,
  pred4: P4,
  mapper4: MapperByRefinement<typeof pred4, R>,
): (value: T) => T | R;
function cases<
  T,
  P1 extends Predicate<T> | Refinement<T, T>,
  P2 extends Predicate<T> | Refinement<T, T>,
  P3 extends Predicate<T> | Refinement<T, T>,
  P4 extends Predicate<T> | Refinement<T, T>,
  R,
>(
  pred1: P1,
  mapper1: MapperByRefinement<typeof pred1, R>,
  pred2: P2,
  mapper2: MapperByRefinement<typeof pred2, R>,
  pred3: P3,
  mapper3: MapperByRefinement<typeof pred3, R>,
  pred4: P4,
  mapper4: MapperByRefinement<typeof pred4, R>,
  defaultFn: DefaultFn<T, R>,
): (value: T) => R;
function cases<
  T,
  P1 extends Predicate<T> | Refinement<T, T>,
  P2 extends Predicate<T> | Refinement<T, T>,
  P3 extends Predicate<T> | Refinement<T, T>,
  P4 extends Predicate<T> | Refinement<T, T>,
  P5 extends Predicate<T> | Refinement<T, T>,
  R,
>(
  pred1: P1,
  mapper1: MapperByRefinement<typeof pred1, R>,
  pred2: P2,
  mapper2: MapperByRefinement<typeof pred2, R>,
  pred3: P3,
  mapper3: MapperByRefinement<typeof pred3, R>,
  pred4: P4,
  mapper4: MapperByRefinement<typeof pred4, R>,
  pred5: P5,
  mapper5: MapperByRefinement<typeof pred5, R>,
): (value: T) => T | R;
function cases<
  T,
  P1 extends Predicate<T> | Refinement<T, T>,
  P2 extends Predicate<T> | Refinement<T, T>,
  P3 extends Predicate<T> | Refinement<T, T>,
  P4 extends Predicate<T> | Refinement<T, T>,
  P5 extends Predicate<T> | Refinement<T, T>,
  R,
>(
  pred1: P1,
  mapper1: MapperByRefinement<typeof pred1, R>,
  pred2: P2,
  mapper2: MapperByRefinement<typeof pred2, R>,
  pred3: P3,
  mapper3: MapperByRefinement<typeof pred3, R>,
  pred4: P4,
  mapper4: MapperByRefinement<typeof pred4, R>,
  pred5: P5,
  mapper5: MapperByRefinement<typeof pred5, R>,
  defaultFn: DefaultFn<T, R>,
): (value: T) => R;
function cases<T, R>(...fns: ((x: T) => boolean | R)[]) {
  return (value: T): typeof fns extends EvenArray ? R | typeof value : R => {
    for (const pair of chunk(2, fns) as Generator<
      [Predicate<T>, Mapper<T, R>] | [DefaultFn<T, R>, undefined]
    >) {
      if (!pair[1]) {
        return pair[0](value);
      }
      if (pair[0](value)) {
        return pair[1](value);
      }
    }
    return value as typeof fns extends EvenArray ? typeof value : never;
  };
}

export default cases;
