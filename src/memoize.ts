/**
 * Creates a new function that, stores the results of its calculations in a {@link http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object | Map}.
 * When the function is called with same input again, it retrieves the cached result instead of recalculating it.
 * If resolver is provided, it determines the cache key for storing the result based on the arguments provided to the memoized function.
 * By default, the first argument provided to the memoized function is used as the map cache key
 *
 * @example
 * ```ts
 * const add10 = (a: number): number => a + 10;
 *
 * const memoized = memoize(add10);
 * console.log(memoized(5)); // 15
 * console.log(memoized(10)) // 20
 * console.log(memoized(5)); // 15 (cached)
 *
 * memoized.cache.clear(); // clear cache
 * console.log(memoized(5)); // 15 (no cache)
 * ```
 */
function memoize<
  F extends (...args: any[]) => any,
  K extends Parameters<F>[0],
  Return extends F & {
    cache: K extends object ? WeakMap<K, ReturnType<F>> : Map<K, ReturnType<F>>;
  },
>(f: F): Return;
function memoize<
  F extends (...args: any[]) => any,
  Resolver extends (...args: Parameters<F>) => any,
  K extends ReturnType<Resolver>,
  Return extends F & {
    cache: K extends object ? WeakMap<K, ReturnType<F>> : Map<K, ReturnType<F>>;
  },
>(f: F, resolver: Resolver): Return;
function memoize<
  F extends (...args: any[]) => any,
  R extends (...args: any[]) => any,
>(f: F, resolver?: R) {
  const memoized = (...args: Parameters<typeof f>): ReturnType<F> => {
    const key = typeof resolver === "function" ? resolver(...args) : args[0];
    const _self = memoized as any;
    if (_self.cache === undefined) {
      _self.cache =
        key != null && typeof key === "object" ? new WeakMap() : new Map();
    }
    const { cache } = _self;
    if (!(cache instanceof WeakMap || cache instanceof Map)) {
      throw new TypeError("`cache` should only use `WeakMap`, `Map`");
    }

    if (cache.has(key)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return cache.get(key)!;
    }
    const result = f(...args);
    cache.set(key, result);
    return result;
  };
  return memoized;
}

export default memoize;
