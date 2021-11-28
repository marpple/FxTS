/**
 * Returns a curried function of `f`
 *
 * @example
 * ```ts
 * const add = (a: number, b: number): number => a + b
 *
 * const curried = curry(add)
 * const add10 = curried(10)
 * console.log(add10(5)) // 15
 * console.log(curried(3, 4)) // 7
 * ```
 */
function curry<F extends (...arg: any) => any>(f: F) {
  const arity = f.length;

  return (function resolver(...args: unknown[]) {
    const memory = [...args];

    return function (...innerArgs: unknown[]) {
      const local = [...memory, ...innerArgs];
      const next = local.length >= arity ? f : resolver;

      return next(...local);
    };
  })();
}

export default curry;
