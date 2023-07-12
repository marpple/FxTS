import type Awaited from "./Awaited";
import type { TuplifyUnion } from "./ExcludeObject";
import type Head from "./Head";
import type Last from "./Last";
import type Tail from "./Tail";

type HasPromise<T extends any[]> = Head<T> extends never
  ? false
  : Head<T> extends Promise<unknown>
  ? true
  : T["length"] extends 0
  ? false
  : HasPromise<Tail<T>>;

type PossiblyHasPromise<T extends any[]> = T extends []
  ? false
  : HasPromise<TuplifyUnion<T[0]>> extends true
  ? true
  : PossiblyHasPromise<Tail<T>>;

type ReturnPipeType<
  T extends any[],
  R = Awaited<Last<T>>,
> = HasPromise<T> extends true
  ? Promise<R>
  : PossiblyHasPromise<T> extends true
  ? Promise<R> | R
  : R;

export default ReturnPipeType;
