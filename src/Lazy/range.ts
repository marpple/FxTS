/**
 * Returns Iterable/AsyncIterable of numbers (positive and/or negative) progressing from start-up to,
 * but not including, end. it's set to start with a start then set to 0.
 *
 * @example
 * ```ts
 * const iter = range(4);
 * iter.next() // {done:false, value: 0}
 * iter.next() // {done:false, value: 1}
 * iter.next() // {done:false, value: 2}
 * iter.next() // {done:false, value: 3}
 * iter.next() // {done:true, value: undefined}
 *
 * // with pipe
 * pipe(
 *  range(4),
 *  toArray,
 * ); // [0, 1, 2, 3]
 *
 * pipe(
 *  range(1, 4),
 *  toArray,
 * ); // [1, 2, 3]
 *
 * // with toAsync
 * await pipe(
 *  range(4),
 *  toAsync,
 *  toArray, // examples https://fxts.dev/docs/overview#concurrent
 * ); // [0, 1, 2, 3]
 * ```
 *
 * {@link https://codesandbox.io/s/fxts-range-3phyd | Try It}
 *
 * see {@link https://fxts.dev/docs/pipe | pipe}, {@link https://fxts.dev/docs/toAsync | toAsync},
 * {@link https://fxts.dev/docs/toArray | toArray}
 */
function range(length: number): IterableIterator<number>;
function range(start: number, end: number): IterableIterator<number>;
function range(
  start: number,
  end: number,
  step: number,
): IterableIterator<number>;
function* range(
  start: number,
  end?: number,
  step = 1,
): IterableIterator<number> {
  if (end === undefined) return yield* range(0, start);
  if (step < 0) {
    while (start > end) {
      yield start;
      start += step;
    }
  } else {
    while (start < end) {
      yield start;
      start += step;
    }
  }
}

export default range;
