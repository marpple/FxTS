type ToUpperCase<
  S extends string,
  Separator extends string = "",
> = S extends `${infer A}${infer B}`
  ? `${A extends Uppercase<A> ? Separator : ""}${Uppercase<A>}${ToUpperCase<
      B,
      Separator
    >}`
  : Uppercase<S>;

export default ToUpperCase;
