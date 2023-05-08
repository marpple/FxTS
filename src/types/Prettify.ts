export type Prettify<T> = NonNullable<{
  [K in keyof T]: T[K];
}>;
