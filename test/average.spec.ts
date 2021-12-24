import { average, pipe, toAsync } from "../src";

describe("average", function () {
  describe("sync", function () {
    it.each([
      [[1, 2, 3, 4, 5], 3],
      [[], NaN],
    ])(
      "should return the average of the given elements",
      function (nums, result) {
        expect(average(nums)).toEqual(result);
      },
    );

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe([1, 2, 3, 4, 5], average);
      expect(res).toEqual(3);
    });
  });

  describe("async", function () {
    it.each([
      [[1, 2, 3, 4, 5], 3],
      [[], NaN],
    ])(
      "should return the average of the given elements",
      async function (nums, result) {
        expect(await average(toAsync(nums))).toEqual(result);
      },
    );

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe([1, 2, 3, 4, 5], toAsync, average);
      expect(res).toEqual(3);
    });
  });
});
