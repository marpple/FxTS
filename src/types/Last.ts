import ArrayInfer from "./ArrayInfer";
import Equals from "./Equals";
import Length from "./Length";

type Last<T extends unknown[]> = Equals<Length<T>, number> extends 1
  ? ArrayInfer<T>
  : T extends [...any, infer U]
  ? U
  : never;

export default Last;
