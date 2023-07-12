import type Awaited from "./Awaited";
import type { TuplifyUnion } from "./ExcludeObject";
import type Head from "./Head";
import type Tail from "./Tail";

type HasPromise<T extends any[]> = Head<T> extends never
  ? false
  : Head<T> extends Promise<unknown>
  ? true
  : T["length"] extends 0
  ? false
  : HasPromise<Tail<T>>;

type PossiblyHasPromise<T extends any[]> = Head<T> extends never
  ? false
  : HasPromise<TuplifyUnion<Head<T>>> extends true
  ? true
  : T["length"] extends 0
  ? false
  : PossiblyHasPromise<Tail<T>>;

type PipeLast<T extends any[]> = T["length"] extends 0
  ? undefined
  : T["length"] extends 1
  ? Head<T>
  : Awaited<T[1]> extends never
  ? never
  : PipeLast<Tail<T>>;

type ReturnPipeType<
  T extends any[],
  R = Awaited<PipeLast<T>>,
> = HasPromise<T> extends true
  ? Promise<R>
  : PossiblyHasPromise<T> extends true
  ? Promise<R> | R
  : R;

export default ReturnPipeType;
