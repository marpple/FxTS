/**
 * Resolve all properties of an object that may be promises.
 *
 * @example
 * ```ts
 * const obj = {
 *  a: Promise.resolve(1),
 *  b: 2,
 *  c: Promise.resolve(3),
 * }
 *
 * const result = await resolveProps(obj);
 * console.log(result); // { a: 1, b: 2, c: 3 }
 * ```
 *
 * Also, with this function, you can define `asyncEvolve` simply.
 *
 * ```ts
 * import { evolve, pipe, resolveProps } from "@fx-ts/core";
 *
 * const asyncEvolve = <T extends object>(transformation:Transformation<T>) =>
 *   (obj:T) => pipe(obj, evolve(transformation), resolveProps)
 *
 * const a = await asyncEvolve({ a: async (a) => a + 1 })({ a: 1 });
 * console.log(a); // { a: 2 }
 *
 * const resultByFormat = await asyncEvolve<Request>({
 *   foo: async (foo) => await fetch(`https://example.com/foo/${foo}`).json(),
 *   bar: async (bar) => await fetch(`https://example.com/bar/${bar}`).text(),
 * })
 * const result = await resultByFormat({foo: "foo", bar: "bar"});
 *
 * console.log({
 *  foo: result.foo,
 *  bar: result.bar,
 * })
 * ```
 *
 * see {@link https://fxts.dev/docs/pipe | pipe} and {@link https://fxts.dev/docs/evolve | evolve}.
 *
 * @typeParam T - Type of input object
 * @typeParam Key - Alias type of Keys of input object which are not symbols
 */
async function resolveProps<T extends object, Key = Exclude<keyof T, symbol>>(
  obj: T,
): Promise<{ [K in keyof T]: K extends Key ? Awaited<T[K]> : never }> {
  return await Promise.all(
    Object.entries(obj).map(async ([k, v]) => [k, await v]),
  ).then(Object.fromEntries);
}

export default resolveProps;
