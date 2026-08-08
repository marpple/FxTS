type FunctionLike = (...args: any[]) => unknown;

/**
 * Checks if `value` is a function.
 *
 * As a type guard it extracts the function members from a union type,
 * so `number | (() => void)` is narrowed to `() => void`.
 *
 * @example
 * ```ts
 * isFunction(() => null); // true
 * isFunction(function () {}); // true
 * isFunction(class A {}); // true
 * isFunction({}); // false
 * isFunction(null); // false
 * isFunction("function"); // false
 * ```
 */
const isFunction = <T>(
  input: T,
): input is Extract<T, FunctionLike> extends never
  ? T & FunctionLike
  : Extract<T, FunctionLike> => {
  return typeof input === "function";
};

export default isFunction;
