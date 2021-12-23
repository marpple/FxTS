import { pipe, toAsync, reverse, toArray, filter, map, delay } from "../../src";
import concurrent, { Concurrent } from "../../src/Lazy/concurrent";
import { callFuncAfterTime, generatorMock } from "../utils";

describe("reverse", function () {
  describe("sync", function () {
    it.each([
      [
        [1, 2, 3, 4],
        [4, 3, 2, 1],
      ],
      ["abcd", ["d", "c", "b", "a"]],
    ])(
      "should return the given elements %s in reverse order %s",
      function (input, result) {
        expect(toArray(reverse(input))).toEqual(result);
      },
    );

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe([1, 2, 3, 4], reverse, toArray);
      expect(res).toEqual([4, 3, 2, 1]);
    });
  });

  describe("async", function () {
    it.each([
      [
        [1, 2, 3, 4],
        [4, 3, 2, 1],
      ],
      ["abcd", ["d", "c", "b", "a"]],
    ])(
      "should return the given elements %s in reverse order %s",
      async function (input, result) {
        expect(await toArray(reverse(toAsync(input as any)))).toEqual(result);
      },
    );

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe([1, 2, 3, 4], toAsync, reverse, toArray);
      expect(res).toEqual([4, 3, 2, 1]);
    });
  });
});
