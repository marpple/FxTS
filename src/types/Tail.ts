type Tail<T extends unknown[]> = T extends [any, ...infer B] ? B : [];

export default Tail;
