import IterationOf from "./Iteration/IterationOf";
import Iteration from "./Iteration/Iteration";

/**
 * from ts-toolbelt repository
 * https://github.com/millsp/ts-toolbelt
 */

/**
 * @hidden
 */
export type _IsNegative<N extends Iteration> = {
  "-": 1;
  "+": 0;
  "0": 0;
}[N[1]];

/**
 * Check whether a [[Number]] is negative or not
 * @param N to check
 * @returns [[Boolean]]
 * @example
 * ```ts
 * type test0 = IsNegative<'0'>  // False
 * type test1 = IsNegative<'-7'> // True
 * type test2 = IsNegative<'7'>  // False
 * ```
 */
type IsNegative<N extends number> = _IsNegative<IterationOf<N>>;

export default IsNegative;
