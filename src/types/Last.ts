import type ArrayInfer from "./ArrayInfer";
import type Equals from "./Equals";
import type Length from "./Length";

type Last<T extends unknown[]> = Equals<Length<T>, number> extends 1
  ? ArrayInfer<T>
  : T extends [...any, infer U]
  ? U
  : never;

export default Last;
