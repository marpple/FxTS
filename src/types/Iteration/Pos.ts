import type Iteration from "./Iteration";

/**
 * from ts-toolbelt repository
 * https://github.com/millsp/ts-toolbelt
 */

/**
 * @param I to query
 * @returns `number`
 * @example
 * ```ts
 *
 * type i = IterationOf<'20'>
 *
 * type test0 = Pos<i>         // 20
 * type test1 = Pos<Next<i>> // 21
 * ```
 */
type Pos<I extends Iteration> = I[0];

export default Pos;
