import pipe1 from "./pipe1";
import reduce from "./reduce";
import Awaited from "./types/Awaited";
import ReturnPipeType from "./types/ReturnPipeType";

/**
 * Performs left to right function composition.
 * The first argument have any value; the remaining arguments must be unary.
 *
 * @example
 * ```ts
 * pipe(
 *  [1, 2, 3, 4, 5],
 *  map(a => a + 10),
 *  filter(a => a % 2 === 0),
 *  toArray,
 * ); // [12, 14]
 *
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4, 5]),
 *  map(a => a + 10),
 *  filter(a => a % 2 === 0),
 *  toArray,
 * ); // [12, 14]
 *
 * // if you want to use asynchronous callback
 * await pipe(
 *  Promise.resolve([1, 2, 3, 4, 5]),
 *  toAsync,
 *  map(async (a) => a + 10),
 *  filter((a) => a % 2 === 0),
 *  toArray,
 * ); // [12, 14]
 *
 * // with toAsync
 * await pipe(
 *  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3), Promise.resolve(4), Promise.resolve(5)],
 *  toAsync,
 *  map(a => a + 10),
 *  filter(a => a % 2 === 0),
 *  toArray,
 * ); // [12, 14]
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-toarray-fy84i | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/map | map}, {@link https://fxts.dev/docs/filter | filter}
 */
// eslint-disable-next-line
// @ts-ignore
// prettier-ignore
function pipe<T1, R>(
  a: T1,
  f1: (a: Awaited<T1>) => R
): ReturnPipeType<[T1,R]>;

// prettier-ignore
function pipe<T1, T2, R>(
  a: T1,
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => R
): ReturnPipeType<[T1, T2, R]>;

function pipe<T1, T2, T3, R>(
  a: T1,
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => R,
): ReturnPipeType<[T1, T2, T3, R]>;

function pipe<T1, T2, T3, T4, R>(
  a: T1,
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => R,
): ReturnPipeType<[T1, T2, T3, T4, R]>;

function pipe<T1, T2, T3, T4, T5, R>(
  a: T1,
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => T5,
  f5: (a: Awaited<T5>) => R,
): ReturnPipeType<[T1, T2, T3, T4, T5, R]>;

function pipe<T1, T2, T3, T4, T5, T6, R>(
  a: T1,
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => T5,
  f5: (a: Awaited<T5>) => T6,
  f6: (a: Awaited<T6>) => R,
): ReturnPipeType<[T1, T2, T3, T4, T5, T6, R]>;

function pipe<T1, T2, T3, T4, T5, T6, T7, R>(
  a: T1,
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => T5,
  f5: (a: Awaited<T5>) => T6,
  f6: (a: Awaited<T6>) => T7,
  f7: (a: Awaited<T7>) => R,
): ReturnPipeType<[T1, T2, T3, T4, T5, T6, T7, R]>;

function pipe<T1, T2, T3, T4, T5, T6, T7, T8, R>(
  a: T1,
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => T5,
  f5: (a: Awaited<T5>) => T6,
  f6: (a: Awaited<T6>) => T7,
  f7: (a: Awaited<T7>) => T8,
  f8: (a: Awaited<T8>) => R,
): ReturnPipeType<[T1, T2, T3, T4, T5, T6, T7, T8, R]>;

function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, R>(
  a: T1,
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => T5,
  f5: (a: Awaited<T5>) => T6,
  f6: (a: Awaited<T6>) => T7,
  f7: (a: Awaited<T7>) => T8,
  f8: (a: Awaited<T8>) => T9,
  f9: (a: Awaited<T9>) => R,
): ReturnPipeType<[T1, T2, T3, T4, T5, T6, T7, T8, T9, R]>;

function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, R>(
  a: T1,
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => T5,
  f5: (a: Awaited<T5>) => T6,
  f6: (a: Awaited<T6>) => T7,
  f7: (a: Awaited<T7>) => T8,
  f8: (a: Awaited<T8>) => T9,
  f9: (a: Awaited<T9>) => T10,
  f10: (a: Awaited<T10>) => R,
): ReturnPipeType<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, R]>;

function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, R>(
  a: T1,
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => T5,
  f5: (a: Awaited<T5>) => T6,
  f6: (a: Awaited<T6>) => T7,
  f7: (a: Awaited<T7>) => T8,
  f8: (a: Awaited<T8>) => T9,
  f9: (a: Awaited<T9>) => T10,
  f10: (a: Awaited<T10>) => T11,
  f11: (a: Awaited<T11>) => R,
): ReturnPipeType<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, R]>;

function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, R>(
  a: T1,
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => T5,
  f5: (a: Awaited<T5>) => T6,
  f6: (a: Awaited<T6>) => T7,
  f7: (a: Awaited<T7>) => T8,
  f8: (a: Awaited<T8>) => T9,
  f9: (a: Awaited<T9>) => T10,
  f10: (a: Awaited<T10>) => T11,
  f11: (a: Awaited<T11>) => T12,
  f12: (a: Awaited<T12>) => R,
): ReturnPipeType<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, R]>;

function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, R>(
  a: T1,
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => T5,
  f5: (a: Awaited<T5>) => T6,
  f6: (a: Awaited<T6>) => T7,
  f7: (a: Awaited<T7>) => T8,
  f8: (a: Awaited<T8>) => T9,
  f9: (a: Awaited<T9>) => T10,
  f10: (a: Awaited<T10>) => T11,
  f11: (a: Awaited<T11>) => T12,
  f12: (a: Awaited<T12>) => T13,
  f13: (a: Awaited<T13>) => R,
): ReturnPipeType<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, R]>;

// prettier-ignore
function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, R>(
  a: T1,
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => T5,
  f5: (a: Awaited<T5>) => T6,
  f6: (a: Awaited<T6>) => T7,
  f7: (a: Awaited<T7>) => T8,
  f8: (a: Awaited<T8>) => T9,
  f9: (a: Awaited<T9>) => T10,
  f10: (a: Awaited<T10>) => T11,
  f11: (a: Awaited<T11>) => T12,
  f12: (a: Awaited<T12>) => T13,
  f13: (a: Awaited<T13>) => T14,
  f14: (a: Awaited<T14>) => R,
): ReturnPipeType<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, R]>;

// prettier-ignore
function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, R>(
  a: T1,
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => T5,
  f5: (a: Awaited<T5>) => T6,
  f6: (a: Awaited<T6>) => T7,
  f7: (a: Awaited<T7>) => T8,
  f8: (a: Awaited<T8>) => T9,
  f9: (a: Awaited<T9>) => T10,
  f10: (a: Awaited<T10>) => T11,
  f11: (a: Awaited<T11>) => T12,
  f12: (a: Awaited<T12>) => T13,
  f13: (a: Awaited<T13>) => T14,
  f14: (a: Awaited<T14>) => T15,
  f15: (a: Awaited<T15>) => R,
): ReturnPipeType<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, R]>;

// prettier-ignore
function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, R>(
  a: T1,
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => T5,
  f5: (a: Awaited<T5>) => T6,
  f6: (a: Awaited<T6>) => T7,
  f7: (a: Awaited<T7>) => T8,
  f8: (a: Awaited<T8>) => T9,
  f9: (a: Awaited<T9>) => T10,
  f10: (a: Awaited<T10>) => T11,
  f11: (a: Awaited<T11>) => T12,
  f12: (a: Awaited<T12>) => T13,
  f13: (a: Awaited<T13>) => T14,
  f14: (a: Awaited<T14>) => T15,
  f15: (a: Awaited<T15>) => T16,
  f16: (a: Awaited<T16>) => R,
): ReturnPipeType<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, R]>;

// prettier-ignore
function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, R>(
  a: T1,
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => T5,
  f5: (a: Awaited<T5>) => T6,
  f6: (a: Awaited<T6>) => T7,
  f7: (a: Awaited<T7>) => T8,
  f8: (a: Awaited<T8>) => T9,
  f9: (a: Awaited<T9>) => T10,
  f10: (a: Awaited<T10>) => T11,
  f11: (a: Awaited<T11>) => T12,
  f12: (a: Awaited<T12>) => T13,
  f13: (a: Awaited<T13>) => T14,
  f14: (a: Awaited<T14>) => T15,
  f15: (a: Awaited<T15>) => T16,
  f16: (a: Awaited<T16>) => T17,
  f17: (a: Awaited<T17>) => R,
): ReturnPipeType<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, R]>;

// prettier-ignore
function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, R>(
  a: T1,
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => T5,
  f5: (a: Awaited<T5>) => T6,
  f6: (a: Awaited<T6>) => T7,
  f7: (a: Awaited<T7>) => T8,
  f8: (a: Awaited<T8>) => T9,
  f9: (a: Awaited<T9>) => T10,
  f10: (a: Awaited<T10>) => T11,
  f11: (a: Awaited<T11>) => T12,
  f12: (a: Awaited<T12>) => T13,
  f13: (a: Awaited<T13>) => T14,
  f14: (a: Awaited<T14>) => T15,
  f15: (a: Awaited<T15>) => T16,
  f16: (a: Awaited<T16>) => T17,
  f17: (a: Awaited<T17>) => T18,
  f18: (a: Awaited<T18>) => R,
): ReturnPipeType<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, R]>;

// prettier-ignore
function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, R>(
  a: T1,
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => T5,
  f5: (a: Awaited<T5>) => T6,
  f6: (a: Awaited<T6>) => T7,
  f7: (a: Awaited<T7>) => T8,
  f8: (a: Awaited<T8>) => T9,
  f9: (a: Awaited<T9>) => T10,
  f10: (a: Awaited<T10>) => T11,
  f11: (a: Awaited<T11>) => T12,
  f12: (a: Awaited<T12>) => T13,
  f13: (a: Awaited<T13>) => T14,
  f14: (a: Awaited<T14>) => T15,
  f15: (a: Awaited<T15>) => T16,
  f16: (a: Awaited<T16>) => T17,
  f17: (a: Awaited<T17>) => T18,
  f18: (a: Awaited<T18>) => T19,
  f19: (a: Awaited<T19>) => R,
): ReturnPipeType<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, R]>;

// prettier-ignore
function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20, R>(
  a: T1,
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => T5,
  f5: (a: Awaited<T5>) => T6,
  f6: (a: Awaited<T6>) => T7,
  f7: (a: Awaited<T7>) => T8,
  f8: (a: Awaited<T8>) => T9,
  f9: (a: Awaited<T9>) => T10,
  f10: (a: Awaited<T10>) => T11,
  f11: (a: Awaited<T11>) => T12,
  f12: (a: Awaited<T12>) => T13,
  f13: (a: Awaited<T13>) => T14,
  f14: (a: Awaited<T14>) => T15,
  f15: (a: Awaited<T15>) => T16,
  f16: (a: Awaited<T16>) => T17,
  f17: (a: Awaited<T17>) => T18,
  f18: (a: Awaited<T18>) => T19,
  f19: (a: Awaited<T19>) => T20,
  f20: (a: Awaited<T20>) => R,
): ReturnPipeType<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20, R]>;

function pipe(a: any, ...fns: any[]) {
  return reduce(pipe1, a, fns);
}

export default pipe;
