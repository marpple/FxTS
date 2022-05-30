type Merge<A extends object, B extends object> = {
  [K in keyof (A & B)]: (A & B)[K];
} & unknown;

export default Merge;
