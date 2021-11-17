import IterationMap from "./IterationMap";
/**
 * from ts-toolbelt repository
 * https://github.com/millsp/ts-toolbelt
 */

/**
 * An entry of `IterationMap`
 */
type Iteration = [
  value: number,
  sign: "-" | "0" | "+",
  prev: keyof IterationMap,
  next: keyof IterationMap,
  oppo: keyof IterationMap
];

export default Iteration;
