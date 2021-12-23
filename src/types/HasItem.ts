type HasItem<T extends any[]> = T extends [any, ...any] ? true : false;

export default HasItem;
