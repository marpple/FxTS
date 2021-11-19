/**
 * This method invokes interceptor and returns a value.
 * The interceptor is invoked with one argument.
 *
 * @example
 * ```ts
 * tap(console.log, [1,2,3,4,5])
 * // log [1, 2, 3, 4, 5]
 * // return [1, 2, 3, 4, 5]
 * ```
 */
function tap<T>(f: (arg: T) => unknown, v: T): T;

function tap<T>(f: (arg: T) => unknown): (v: T) => T;

function tap<T>(f: (arg: T) => unknown, v?: T): T | ((v: T) => T) {
  if (v === undefined) {
    return (v: T) => (v instanceof Promise ? v.then(f) : f(v), v);
  }
  return v instanceof Promise ? v.then(f) : f(v), v;
}

export default tap;
