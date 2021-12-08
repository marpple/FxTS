import Awaited from "./types/Awaited";
/**
 * This method invokes interceptor and returns a value.
 * The interceptor is invoked with one argument.
 *
 * @example
 * ```ts
 * tap(console.log, [1,2,3,4,5])
 * // log [1, 2, 3, 4, 5]
 * // return [1, 2, 3, 4, 5]
 *
 * tap(async (a) => console.log(a), [1,2,3,4,5]);
 * // log [1, 2, 3, 4, 5]
 * // return Promise<[1, 2, 3, 4, 5]>
 * ```
 */
function tap<T, U>(
  f: (arg: Awaited<T>) => U,
  v: T,
): U extends Promise<any> ? Promise<Awaited<T>> : T;

function tap<T, U>(
  f: (arg: Awaited<T>) => U,
): (v: T) => U extends Promise<any> ? Promise<Awaited<T>> : T;

function tap<T, U>(
  f: (arg: Awaited<T>) => U,
  v?: T,
):
  | T
  | Promise<T>
  | ((v: T) => U extends Promise<any> ? Promise<Awaited<T>> : T) {
  if (v === undefined) {
    return (v: T) =>
      (v instanceof Promise ? v.then(f) : f(v as Awaited<T>),
      v) as U extends Promise<any> ? Promise<Awaited<T>> : T;
  }

  const res = v instanceof Promise ? v.then(f) : f(v as Awaited<T>);
  if (res instanceof Promise) {
    return res.then(() => v);
  }

  return v;
}

export default tap;
