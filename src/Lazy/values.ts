function* values<T extends Record<string, any>>(obj: T) {
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      yield obj[k];
    }
  }
}

export default values;
