import Iteration from "./Iteration";
import IterationMap from "./IterationMap";

/**
 * from ts-toolbelt repository
 * https://github.com/millsp/ts-toolbelt
 */

type Prev<I extends Iteration> = IterationMap[I[2]]; // continues iterating

export default Prev;
