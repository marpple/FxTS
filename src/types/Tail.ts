/* eslint-disable @typescript-eslint/no-explicit-any */
type Tail<T extends unknown[]> = ((...args: T) => any) extends (
  a: any,
  ...args: infer U
) => any
  ? U
  : [];

export default Tail;
