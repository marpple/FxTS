import Arrow from "./types/Arrow";

/**
 * Applies function `f` to the argument list `args`.
 *
 * @example
 * ```ts
 * apply(Math.max, [1, 2, 3, 4, 5]); // 5
 *
 * pipe(
 *   repeat(10),
 *   map(a => a * Math.random())
 *   take(5),
 *   apply(max)
 * );
 * ```
 */

function apply<F extends Arrow, T extends Parameters<F>>(
  f: F,
): (args: T) => ReturnType<typeof f>;

function apply<F extends Arrow, T extends Parameters<F>>(
  f: F,
  args: T,
): ReturnType<typeof f>;

function apply<F extends Arrow, T extends Parameters<F>>(
  f: F,
  args?: T,
):
  | ReturnType<typeof f>
  | ((args: Parameters<typeof f>) => ReturnType<typeof f>) {
  if (args === undefined) {
    return (args) => f(...args);
  } else {
    return f(...args);
  }
}

export default apply;
