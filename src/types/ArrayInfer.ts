type ArrayInfer<T> = T extends (infer U)[] ? U : never;

export default ArrayInfer;
