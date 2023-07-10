import type Awaited from "./Awaited";
import type { TuplifyUnion } from "./ExcludeObject";
import type Last from "./Last";
import type Tail from "./Tail";

type IsAny<T> = 0 extends 1 & T ? true : false;

type HasPromise<T extends any[]> = T extends []
  ? false
  : IsAny<T[0]> extends true
  ? HasPromise<Tail<T>>
  : T extends [Promise<any>, ...any]
  ? true
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
