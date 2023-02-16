import type IterationMap from "./IterationMap";

/**
 * from ts-toolbelt repository
 * https://github.com/millsp/ts-toolbelt
 */

/**
 * Transform a number into an [[Iteration]]
 * (to use [[Prev]], [[Next]], & [[Pos]])
 * @param N to transform
 * @returns [[Iteration]]
 * @example
 * ```ts
 * type i = IterationOf<0> // ["-1", "1", "0", 0, "0"]
 *
 * type next = Next<i>       // ["0", "2", "1", 1, "+"]
 * type prev = Prev<i>       // ["-2", "0", "-1", -1, "-"]
 *
 * type nnext = Pos<next>    // +1
 * type nprev = Pos<prev>    // -1
 * ```
 */
type IterationOf<N extends number> = `${N}` extends keyof IterationMap
  ? IterationMap[`${N}`]
  : IterationMap["__"];

export default IterationOf;
