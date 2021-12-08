type IdentityObject<T> = T extends object ? T : never;

function isObject<T = unknown>(a: T): a is IdentityObject<T> {
  const type = typeof a;
  return a != null && (type === "object" || type === "function");
}

export default isObject;
