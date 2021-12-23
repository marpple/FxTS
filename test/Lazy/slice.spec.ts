import { pipe, slice, toArray, toAsync } from "../../src";

describe("slice", function () {
  describe("sync", function () {
    it.each([
      [1, 3, [1, 2, 3, 4, 5], [2, 3]],
      [-1, 3, [1, 2, 3, 4, 5], [1, 2, 3]],
      [2, Infinity, [1, 2, 3, 4, 5], [3, 4, 5]],
      [7, 3, [1, 2, 3, 4, 5], []],
      [1, 3, "abcde", ["b", "c"]],
    ])(
      "should return elements from startIndex(%i) to endIndex(%i) of %s",
      function (startIndex, endIndex, iterable, result) {
        expect(
          toArray(slice(startIndex, endIndex, iterable as Iterable<any>)),
        ).toEqual(result);
      },
    );

    it.each([
      [1, [1, 2, 3, 4, 5], [2, 3, 4, 5]],
      [-1, [1, 2, 3, 4, 5], [1, 2, 3, 4, 5]],
      [2, [1, 2, 3, 4, 5], [3, 4, 5]],
      [7, [1, 2, 3, 4, 5], []],
      [1, "abcde", ["b", "c", "d", "e"]],
    ])(
      "should return elements from startIndex(%i) to end of %s",
      function (startIndex, iterable, result) {
        expect(toArray(slice(startIndex, iterable as Iterable<any>))).toEqual(
          result,
        );
      },
    );

    it("should be able to be used as a curried function in the pipeline", function () {
      const res1 = pipe([1, 2, 3, 4, 5], slice(2), toArray);
      expect(res1).toEqual([3, 4, 5]);

      const res2 = pipe([1, 2, 3, 4, 5], slice(1, 3), toArray);
      expect(res2).toEqual([2, 3]);
    });
  });

  describe("async", function () {
    it.each([
      [1, 3, [1, 2, 3, 4, 5], [2, 3]],
      [-1, 3, [1, 2, 3, 4, 5], [1, 2, 3]],
      [2, Infinity, [1, 2, 3, 4, 5], [3, 4, 5]],
      [7, 3, [1, 2, 3, 4, 5], []],
      [1, 3, "abcde", ["b", "c"]],
    ])(
      "should return elements from startIndex(%i) to endIndex(%i) of %s",
      async function (startIndex, endIndex, iterable, result) {
        expect(
          await toArray(
            slice(startIndex, endIndex, toAsync(iterable as Iterable<any>)),
          ),
        ).toEqual(result);
      },
    );

    it.each([
      [1, [1, 2, 3, 4, 5], [2, 3, 4, 5]],
      [-1, [1, 2, 3, 4, 5], [1, 2, 3, 4, 5]],
      [2, [1, 2, 3, 4, 5], [3, 4, 5]],
      [7, [1, 2, 3, 4, 5], []],
      [1, "abcde", ["b", "c", "d", "e"]],
    ])(
      "should return elements from startIndex(%i) to end of %s",
      async function (startIndex, iterable, result) {
        expect(
          await toArray(slice(startIndex, toAsync(iterable as Iterable<any>))),
        ).toEqual(result);
      },
    );

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res1 = await pipe([1, 2, 3, 4, 5], toAsync, slice(2), toArray);
      expect(res1).toEqual([3, 4, 5]);

      const res2 = await pipe([1, 2, 3, 4, 5], toAsync, slice(1, 3), toArray);
      expect(res2).toEqual([2, 3]);
    });
  });
});
