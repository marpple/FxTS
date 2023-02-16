import type Iteration from "./Iteration";
import type IterationMap from "./IterationMap";

/**
 * from ts-toolbelt repository
 * https://github.com/millsp/ts-toolbelt
 */

type Next<I extends Iteration> = IterationMap[I[3]];

export default Next;
