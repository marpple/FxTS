import { size, toAsync } from "../src";

describe("size", function () {
  describe("sync", function () {
    it.each([
      [[1, 2, 3, 4, 5], 5],
      ["abcdef", 6],
    ])("should return the size of elements %s", function (iterable, result) {
      expect(size(iterable)).toEqual(result);
    });
  });

  describe("async", function () {
    it.each([
      [[1, 2, 3, 4, 5], 5],
      ["abcdef", 6],
    ])(
      "should return the size of elements %s",
      async function (iterable, result) {
        expect(await size(toAsync(iterable as any[]))).toEqual(result);
      },
    );
  });
});
