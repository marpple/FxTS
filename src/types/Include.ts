type Include<T, N> = T extends N ? T : never;

export default Include;
