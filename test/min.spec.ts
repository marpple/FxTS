import { min, toAsync } from "../src";

describe("min", function () {
  describe("sync", function () {
    it.each([
      [[3, 4, 5, 1, 6], 1],
      [[0, Infinity, 3], 0],
      [[0, -Infinity, 3], -Infinity],
      [[0, Infinity, 3, NaN], NaN],
      [[0, 2, 3, NaN], NaN],
      [[], 0],
    ])("should the smallest of given iterable %s %s", function (input, result) {
      expect(min(input)).toEqual(result);
    });
  });

  describe("async", function () {
    it.each([
      [[3, 4, 5, 1, 6], 1],
      [[0, Infinity, 3], 0],
      [[0, -Infinity, 3], -Infinity],
      [[0, Infinity, 3, NaN], NaN],
      [[0, 2, 3, NaN], NaN],
      [[], 0],
    ])(
      "should the smallest of given asyncIterable %s %s",
      async function (input, result) {
        expect(await min(toAsync(input))).toEqual(result);
      },
    );
  });
});
