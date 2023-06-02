import { consume, peek, pipe, toAsync } from "../src";

describe("consume", function () {
  describe("sync", function () {
    const testParameters = [
      {
        input: [1, 2, 3, 4, 5][Symbol.iterator](),
        n: 2,
        expected: 3,
      },
      {
        input: [1, 2, 3, 4, 5][Symbol.iterator](),
        n: undefined,
        expected: undefined,
      },
      {
        input: [1, 2, 3, 4, 5][Symbol.iterator](),
        n: Infinity,
        expected: undefined,
      },
    ];

    it.each(testParameters)(
      "should be consumed the given number",
      ({ input, n, expected }) => {
        consume(input, n);
        expect(input.next().value).toEqual(expected);
      },
    );

    it("should be able to be used as a curried function in the pipeline", function () {
      const iter = [1, 2, 3, 4][Symbol.iterator]();
      let res = 0;
      pipe(
        iter,
        peek((a) => {
          res += a;
        }),
        consume,
      );

      expect(res).toEqual(10);
      expect(iter.next().done).toEqual(true);
    });
  });

  describe("async", function () {
    const testParameters = [
      {
        input: toAsync([1, 2, 3, 4, 5])[Symbol.asyncIterator](),
        n: 2,
        expected: 3,
      },
      {
        input: toAsync([1, 2, 3, 4, 5])[Symbol.asyncIterator](),
        n: undefined,
        expected: undefined,
      },
      {
        input: toAsync([1, 2, 3, 4, 5])[Symbol.asyncIterator](),
        n: Infinity,
        expected: undefined,
      },
    ];

    it.each(testParameters)(
      "should be consumed the given number",
      async ({ input, n, expected }) => {
        await consume(input, n);
        expect((await input.next()).value).toEqual(expected);
      },
    );

    it("should be able to be used as a curried function in the pipeline", async function () {
      const iter = toAsync([1, 2, 3, 4])[Symbol.asyncIterator]();
      let res = 0;
      await pipe(
        iter,
        peek((a) => {
          res += a;
        }),
        consume,
      );

      expect(res).toEqual(10);
      expect((await iter.next()).done).toEqual(true);
    });
  });
});
