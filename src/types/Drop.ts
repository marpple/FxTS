import type Length from "./Length";
import type Prepend from "./Prepend";
import type Tail from "./Tail";

type Drop<N extends number, T extends any[], I extends any[] = []> = {
  0: Drop<N, Tail<T>, Prepend<I, any>>;
  1: T;
}[Length<I> extends N ? 1 : 0];

export default Drop;
