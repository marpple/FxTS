export type SyncReducer<Acc, T> = (acc: Acc, value: T) => Acc;

export type AsyncReducer<Acc, T> = (acc: Acc, value: T) => Acc | Promise<Acc>;
