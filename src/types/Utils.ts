export type UniversalIterator<T = unknown> = Iterator<T> | AsyncIterator<T>;

export type UniversalIterable<T = unknown> = Iterable<T> | AsyncIterable<T>;

export type Iter<T> = UniversalIterator<T> | UniversalIterable<T>;

export type Resolve<T> = (a: IteratorResult<T>) => void;

export type Reject = (reason: any) => void;
