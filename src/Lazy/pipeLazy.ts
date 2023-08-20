import pipe1 from "../pipe1";
import reduce from "../reduce";
import type Awaited from "../types/Awaited";
import type ReturnPipeType from "../types/ReturnPipeType";

/**
 * Make function, that performs left to right function composition.
 * All arguments must be unary.
 *
 * @example
 * ```ts
 * pipeLazy(
 *  map(a => a + 10),
 *  filter(a => a % 2 === 0),
 *  toArray,
 * )([1, 2, 3, 4, 5]); // [12, 14]
 *
 * await pipeLazy(
 *  map(a => a + 10),
 *  filter(a => a % 2 === 0),
 *  toArray,
 * )(Promise.resolve([1, 2, 3, 4, 5])); // [12, 14]
 *
 * // if you want to use asynchronous callback
 * await pipeLazy(
 *  toAsync,
 *  map(async (a) => a + 10),
 *  filter((a) => a % 2 === 0),
 *  toArray,
 * )(Promise.resolve([1, 2, 3, 4, 5])); // [12, 14]
 *
 * // with toAsync
 * await pipeLazy(
 *  toAsync,
 *  map(a => a + 10),
 *  filter(a => a % 2 === 0),
 *  toArray,
 * )([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3), Promise.resolve(4), Promise.resolve(5)]); // [12, 14]
 * ```
 *
 * see {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/map | map}, {@link https://fxts.dev/docs/filter | filter}
 */
// eslint-disable-next-line
// @ts-ignore
// prettier-ignore
function pipeLazy<T1, R>(
  f1: (a: Awaited<T1>) => R
): 
  & ((a: T1) => ReturnPipeType<[T1,R]>)
  & ((a: Promise<T1>) => ReturnPipeType<[Promise<T1>,R]>);

// prettier-ignore
function pipeLazy<T1, T2, R>(
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => R
):
  & ((a: T1) => ReturnPipeType<[T1,T2,R]>)
  & ((a: Promise<T1>) => ReturnPipeType<[Promise<T1>,T2,R]>);

// prettier-ignore
function pipeLazy<T1, T2, T3, R>(
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => R,
):
  & ((a: T1) => ReturnPipeType<[T1,T2,T3,R]>)
  & ((a: Promise<T1>) => ReturnPipeType<[Promise<T1>,T2,T3,R]>);

// prettier-ignore
function pipeLazy<T1, T2, T3, T4, R>(
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => R,
):
  & ((a: T1) => ReturnPipeType<[T1,T2,T3,T4,R]>)
  & ((a: Promise<T1>) => ReturnPipeType<[Promise<T1>,T2,T3,T4,R]>);

// prettier-ignore
function pipeLazy<T1, T2, T3, T4, T5, R>(
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => T5,
  f5: (a: Awaited<T5>) => R,
):
  & ((a: T1) => ReturnPipeType<[T1,T2,T3,T4,T5,R]>)
  & ((a: Promise<T1>) => ReturnPipeType<[Promise<T1>,T2,T3,T4,T5,R]>);

// prettier-ignore
function pipeLazy<T1, T2, T3, T4, T5, T6, R>(
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => T5,
  f5: (a: Awaited<T5>) => T6,
  f6: (a: Awaited<T6>) => R,
):
  & ((a: T1) => ReturnPipeType<[T1,T2,T3,T4,T5,T6,R]>)
  & ((a: Promise<T1>) => ReturnPipeType<[Promise<T1>,T2,T3,T4,T5,T6,R]>);

// prettier-ignore
function pipeLazy<T1, T2, T3, T4, T5, T6, T7, R>(
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => T5,
  f5: (a: Awaited<T5>) => T6,
  f6: (a: Awaited<T6>) => T7,
  f7: (a: Awaited<T7>) => R,
):
  & ((a: T1) => ReturnPipeType<[T1,T2,T3,T4,T5,T6,T7,R]>)
  & ((a: Promise<T1>) => ReturnPipeType<[Promise<T1>,T2,T3,T4,T5,T6,T7,R]>);

// prettier-ignore
function pipeLazy<T1, T2, T3, T4, T5, T6, T7, T8, R>(
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => T5,
  f5: (a: Awaited<T5>) => T6,
  f6: (a: Awaited<T6>) => T7,
  f7: (a: Awaited<T7>) => T8,
  f8: (a: Awaited<T8>) => R,
):
  & ((a: T1) => ReturnPipeType<[T1,T2,T3,T4,T5,T6,T7,T8,R]>)
  & ((a: Promise<T1>) => ReturnPipeType<[Promise<T1>,T2,T3,T4,T5,T6,T7,T8,R]>);

// prettier-ignore
function pipeLazy<T1, T2, T3, T4, T5, T6, T7, T8, T9, R>(
  f1: (a: Awaited<T1>) => T2,
  f2: (a: Awaited<T2>) => T3,
  f3: (a: Awaited<T3>) => T4,
  f4: (a: Awaited<T4>) => T5,
  f5: (a: Awaited<T5>) => T6,
  f6: (a: Awaited<T6>) => T7,
  f7: (a: Awaited<T7>) => T8,
  f8: (a: Awaited<T8>) => T9,
  f9: (a: Awaited<T9>) => R,
):
  & ((a: T1) => ReturnPipeType<[T1,T2,T3,T4,T5,T6,T7,T8,T9,R]>)
  & ((a: Promise<T1>) => ReturnPipeType<[Promise<T1>,T2,T3,T4,T5,T6,T7,T8,T9,R]>);

// prettier-ignore
function pipeLazy<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, R>(
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
):
  & ((a: T1) => ReturnPipeType<[T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,R]>)
  & ((a: Promise<T1>) => ReturnPipeType<[Promise<T1>,T2,T3,T4,T5,T6,T7,T8,T9,T10,R]>);

// prettier-ignore
function pipeLazy<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, R>(
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
):
  & ((a: T1) => ReturnPipeType<[T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,R]>)
  & ((a: Promise<T1>) => ReturnPipeType<[Promise<T1>,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,R]>);

// prettier-ignore
function pipeLazy<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, R>(
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
):
  & ((a: T1) => ReturnPipeType<[T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,R]>)
  & ((a: Promise<T1>) => ReturnPipeType<[Promise<T1>,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,R]>);

// prettier-ignore
function pipeLazy<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, R>(
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
):
  & ((a: T1) => ReturnPipeType<[T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,R]>)
  & ((a: Promise<T1>) => ReturnPipeType<[Promise<T1>,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,R]>);

// prettier-ignore
function pipeLazy<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, R>(
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
):
  & ((a: T1) => ReturnPipeType<[T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,R]>)
  & ((a: Promise<T1>) => ReturnPipeType<[Promise<T1>,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,R]>);

// prettier-ignore
function pipeLazy<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, R>(
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
):
  & ((a: T1) => ReturnPipeType<[T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,R]>)
  & ((a: Promise<T1>) => ReturnPipeType<[Promise<T1>,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,R]>);

// prettier-ignore
function pipeLazy<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, R>(
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
):
  & ((a: T1) => ReturnPipeType<[T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,R]>)
  & ((a: Promise<T1>) => ReturnPipeType<[Promise<T1>,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,R]>);

// prettier-ignore
function pipeLazy<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, R>(
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
):
  & ((a: T1) => ReturnPipeType<[T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,R]>)
  & ((a: Promise<T1>) => ReturnPipeType<[Promise<T1>,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,R]>);

// prettier-ignore
function pipeLazy<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, R>(
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
):
  & ((a: T1) => ReturnPipeType<[T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,R]>)
  & ((a: Promise<T1>) => ReturnPipeType<[Promise<T1>,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,R]>);

// prettier-ignore
function pipeLazy<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, R>(
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
):
  & ((a: T1) => ReturnPipeType<[T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,R]>)
  & ((a: Promise<T1>) => ReturnPipeType<[Promise<T1>,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,R]>);

// prettier-ignore
function pipeLazy<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20, R>(
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
):
  & ((a: T1) => ReturnPipeType<[T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,R]>)
  & ((a: Promise<T1>) => ReturnPipeType<[Promise<T1>,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,R]>);

function pipeLazy(...fns: any[]) {
  return (a: any) => reduce(pipe1, a, fns);
}

export default pipeLazy;
