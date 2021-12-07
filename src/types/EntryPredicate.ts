export type AsyncEntryPredicate<T extends object> = ([key, value]: [
  keyof T,
  T[keyof T],
]) => Promise<boolean>;

export type ConditionalAsyncEntryPredicate<T extends object> = ([key, value]: [
  keyof T,
  T[keyof T],
]) => boolean | Promise<boolean>;

export type EntryPredicate<T extends object> = ([key, value]: [
  keyof T,
  T[keyof T],
]) => boolean;
