import type Falsy from "./Falsy";

type FalsyTypesOf<T> = T extends Falsy ? T : never;

export default FalsyTypesOf;
