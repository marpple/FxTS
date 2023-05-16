type _Equals1<A1, A2> = A1 extends A2 ? (A2 extends A1 ? 1 : 0) : 0;
type _Equals2<A1, A2> = (<A>() => A extends A2 ? 1 : 0) extends <
  A,
>() => A extends A1 ? 1 : 0
  ? 1
  : 0;

// type Test1 = _Equals1<{ a: number; b: string }, { a: number } & { b: string }>;
// type Test2 = _Equals2<{ a: number; b: string }, { a: number } & { b: string }>;
//
// const test1: Test1 = 1;
// const test2: Test2 = 1;

type Equals<A1, A2> = _Equals1<A1, A2> extends 1 ? 1 : _Equals2<A1, A2>;

export default Equals;
