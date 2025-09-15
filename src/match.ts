import { chunk } from "./Lazy";

type Arrow = (...args: any[]) => any;
type Predicate<U, T extends U> = (value: U) => value is T;
type Mapper<T, R> = (value: T) => R;
type Thrower<U> = (error: U) => never;
type DefaultFn<U, T, R> = Mapper<Exclude<U, T>, R> | Thrower<Exclude<U, T>>;
type MatchPair<U, T extends U, R> = [Predicate<U, T>, Mapper<T, R>];

/**
 * Returns a mapped value based on the first matching predicate.
 * If a match is found, the corresponding mapper function is executed and its result is returned.
 * If an odd number of functions are provided, the last function acts as a `default` function.
 * The `default` function can either map the result value or throw an error.
 * Among the other functions, odd-positioned functions are `predicate`s and even-positioned functions are `mapper`s.
 * `predicate` and `mapper` functions form pairs with each other.
 * A `predicate` returns a boolean value.
 * A `mapper` transforms the input value to the result value.
 * The input value is mapped to the result value by the `mapper` that pairs with the first `predicate` that returns true.
 *
 * @example
 * ```ts
 * pipe(
 *   ['hello', 42, true],
 *   map(
 *     match(
 *       isString, (s) => `String: ${s}`,
 *       isNumber, (n) => `Number: ${n}`,
 *       () => 'Unknown type'
 *     )
 *   ),
 *   toArray,
 * ); // ['String: hello', 'Number: 42', 'Unknown type']
 *
 * pipe(
 *   ['hello', 42, true],
 *   map(
 *     match(
 *       isString, (s) => `String: ${s}`,
 *       isNumber, (n) => `Number: ${n}`,
 *       throwError((input) => Error(`Unknown type: ${input}`))
 *     )
 *   ),
 *   toArray,
 * ); // Uncaught Error: Unknown type: true
 * ```
 *
 * The max number of pairs is 5.
 * So, if you want to match more than 5 types, you can use `match` inside a `default` function.
 *
 * @example
 * ```ts
 * interface A {
 *   id: number;
 *   type: "A";
 * }
 *
 * const _as: A[] = [
 *   { id: 1, type: "A" },
 *   { id: 2, type: "A" },
 *   { id: 3, type: "A" },
 *   { id: 4, type: "A" },
 *   { id: 5, type: "A" },
 *   { id: 6, type: "A" },
 * ] as const;
 *
 * const narrowA = <T extends number>(id: T) => (a: A): a is A & { id: T } =>
 *   a.id === id;
 *
 * const getId = <T extends number>(a: A): T => a.id as T;
 *
 * const res4: (1 | 2 | 3 | 4 | 5 | 6)[] = pipe(
 *   _as,
 *   map(match(
 *     narrowA(1), getId<1>,
 *     narrowA(2), getId<2>,
 *     narrowA(3), getId<3>,
 *     narrowA(4), getId<4>,
 *     narrowA(5), getId<5>,
 *     match(
 *       narrowA(6), getId<6>,
 *       throwError((a) => Error(`Unknown id: ${a.id}`)),
 *     ),
 *   )),
 *   toArray,
 * );
 * ```
 */
function match(): (value: unknown) => never;
function match<U, R>(...fns: [DefaultFn<U, never, R>]): (value: U) => R;
function match<U, R, T1 extends U>(
  ...fns: U extends T1 ? [Predicate<U, T1>, Mapper<T1, R>] : never
): (value: U) => R;
function match<U, R, T1 extends U>(
  ...fns: [Predicate<U, T1>, Mapper<T1, R>, DefaultFn<U, T1, R>]
): (value: U) => R;
function match<U, R, T1 extends U, T2 extends Exclude<U, T1>>(
  ...fns: U extends T1 | T2
    ? [Predicate<U, T1>, Mapper<T1, R>, Predicate<U, T2>, Mapper<T2, R>]
    : never
): (value: U) => R;
function match<U, R, T1 extends U, T2 extends Exclude<U, T1>>(
  ...fns: [
    Predicate<U, T1>,
    Mapper<T1, R>,
    Predicate<U, T2>,
    Mapper<T2, R>,
    DefaultFn<U, T1 | T2, R>,
  ]
): (value: U) => R;
function match<
  U,
  R,
  T1 extends U,
  T2 extends Exclude<U, T1>,
  T3 extends Exclude<U, T1 | T2>,
>(
  ...fns: U extends T1 | T2 | T3
    ? [
        Predicate<U, T1>,
        Mapper<T1, R>,
        Predicate<U, T2>,
        Mapper<T2, R>,
        Predicate<U, T3>,
        Mapper<T3, R>,
      ]
    : never
): (value: U) => R;
function match<
  U,
  R,
  T1 extends U,
  T2 extends Exclude<U, T1>,
  T3 extends Exclude<U, T1 | T2>,
>(
  ...fns: [
    Predicate<U, T1>,
    Mapper<T1, R>,
    Predicate<U, T2>,
    Mapper<T2, R>,
    Predicate<U, T3>,
    Mapper<T3, R>,
    DefaultFn<U, T1 | T2 | T3, R>,
  ]
): (value: U) => R;
function match<
  U,
  R,
  T1 extends U,
  T2 extends Exclude<U, T1>,
  T3 extends Exclude<U, T1 | T2>,
  T4 extends Exclude<U, T1 | T2 | T3>,
>(
  ...fns: U extends T1 | T2 | T3 | T4
    ? [
        Predicate<U, T1>,
        Mapper<T1, R>,
        Predicate<U, T2>,
        Mapper<T2, R>,
        Predicate<U, T3>,
        Mapper<T3, R>,
        Predicate<U, T4>,
        Mapper<T4, R>,
      ]
    : never
): (value: U) => R;
function match<
  U,
  R,
  T1 extends U,
  T2 extends Exclude<U, T1>,
  T3 extends Exclude<U, T1 | T2>,
  T4 extends Exclude<U, T1 | T2 | T3>,
>(
  ...fns: [
    Predicate<U, T1>,
    Mapper<T1, R>,
    Predicate<U, T2>,
    Mapper<T2, R>,
    Predicate<U, T3>,
    Mapper<T3, R>,
    Predicate<U, T4>,
    Mapper<T4, R>,
    DefaultFn<U, T1 | T2 | T3 | T4, R>,
  ]
): (value: U) => R;
function match<
  U,
  R,
  T1 extends U,
  T2 extends Exclude<U, T1>,
  T3 extends Exclude<U, T1 | T2>,
  T4 extends Exclude<U, T1 | T2 | T3>,
  T5 extends Exclude<U, T1 | T2 | T3 | T4>,
>(
  ...fns: U extends T1 | T2 | T3 | T4 | T5
    ? [
        Predicate<U, T1>,
        Mapper<T1, R>,
        Predicate<U, T2>,
        Mapper<T2, R>,
        Predicate<U, T3>,
        Mapper<T3, R>,
        Predicate<U, T4>,
        Mapper<T4, R>,
        Predicate<U, T5>,
        Mapper<T5, R>,
      ]
    : never
): (value: U) => R;
function match<
  U,
  R,
  T1 extends U,
  T2 extends Exclude<U, T1>,
  T3 extends Exclude<U, T1 | T2>,
  T4 extends Exclude<U, T1 | T2 | T3>,
  T5 extends Exclude<U, T1 | T2 | T3 | T4>,
>(
  ...fns: [
    Predicate<U, T1>,
    Mapper<T1, R>,
    Predicate<U, T2>,
    Mapper<T2, R>,
    Predicate<U, T3>,
    Mapper<T3, R>,
    Predicate<U, T4>,
    Mapper<T4, R>,
    Predicate<U, T5>,
    Mapper<T5, R>,
    DefaultFn<U, T1 | T2 | T3 | T4 | T5, R>,
  ]
): (value: U) => R;
function match<U, R>(...fns: Arrow[]): (value: U) => R {
  return function (value: U): R {
    for (const pair of chunk(2, fns) as Generator<
      MatchPair<U, U, R> | [Mapper<U, R> | Thrower<U>, undefined]
    >) {
      if (!pair[1]) {
        return pair[0](value);
      }
      if (pair[0](value)) {
        return pair[1](value);
      }
    }
    throw new Error(`No match found for value: ${value}`);
  };
}

export default match;
