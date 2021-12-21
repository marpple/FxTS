import { max, toAsync } from "../src";

describe("max", function () {
  describe("sync", function () {
    it.each([
      [[3, 4, 5, 1, 6], 6],
      [[0, Infinity, 3], Infinity],
      [[0, Infinity, 3, NaN], NaN],
      [[0, 2, 3, NaN], NaN],
      [[], -Infinity],
    ])("should the largest of given iterable %s %s", function (input, result) {
      expect(max(input)).toEqual(result);
    });
  });

  describe("async", function () {
    it.each([
      [[3, 4, 5, 1, 6], 6],
      [[0, Infinity, 3], Infinity],
      [[0, Infinity, 3, NaN], NaN],
      [[0, 2, 3, NaN], NaN],
      [[], -Infinity],
    ])(
      "should the largest of given asyncIterable %s %s",
      async function (input, result) {
        expect(await max(toAsync(input))).toEqual(result);
      },
    );
  });
});
