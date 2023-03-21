import type Falsy from "./Falsy";

type TruthyTypesOf<T> = T extends Falsy ? never : T;

export default TruthyTypesOf;
