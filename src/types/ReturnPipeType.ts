import Awaited from "./Awaited";
import Drop from "./Drop";
import Prepend from "./Prepend";

type ReturnPipeType<T extends any[]> = T extends [
  a: infer A,
  b: infer B,
  ...args: any[]
]
  ? A extends Promise<any>
    ? ReturnPipeType<Prepend<Drop<2, T>, Promise<Awaited<B>>>>
    : ReturnPipeType<Prepend<Drop<2, T>, B>>
  : T[0];

export default ReturnPipeType;
