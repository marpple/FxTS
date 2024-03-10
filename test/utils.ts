export const generatorMock = (cnt = 10): AsyncIterableIterator<number> => {
  let concurrent: any;

  return {
    getConcurrent() {
      return concurrent;
    },
    async next(_concurrent: any) {
      concurrent = _concurrent;
      if (--cnt) {
        return { done: true, value: undefined };
      }
      return { done: false, value: null };
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  } as any;
};
