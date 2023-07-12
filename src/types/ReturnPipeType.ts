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

type ReturnPipeType<T extends any[]> = HasPromise<T> extends true
  ? Promise<Awaited<R<T>>>
  : PossiblyHasPromise<T> extends true
  ? Promise<Awaited<R<T>>> | Awaited<R<T>>
  : R<T>;

export default ReturnPipeType;

type R<T extends any[]> = T["length"] extends 0
  ? undefined
  : T["length"] extends 1
  ? T[0]
  : Awaited<T[1]> extends never
  ? never
  : R<Tail<T>>;
