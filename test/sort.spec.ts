import { filter, pipe, sort, toAsync } from "../src";

describe("sort", function () {
  const sortFn = (a: number | string, b: number | string) => {
    if (a === b) {
      return 0;
    }
    if (a > b) {
      return 1;
    }
    return -1;
  };

  describe("sync", function () {
    it.each([
      [[], []],
      [
        [3, 4, 1, 2, 5, 2],
        [1, 2, 2, 3, 4, 5],
      ],
      ["bcdaef", ["a", "b", "c", "d", "e", "f"]],
    ])("should sort the elements", function (iterable, result) {
      expect(sort(sortFn, iterable as Iterable<any>)).toEqual(result);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        [3, 4, 1, 2, 5, 2],
        filter((a) => a % 2 !== 0),
        sort(sortFn),
      );
      expect(res).toEqual([1, 3, 5]);
    });
  });

  describe("async", function () {
    it.each([
      [[], []],
      [
        [3, 4, 1, 2, 5, 2],
        [1, 2, 2, 3, 4, 5],
      ],
      ["bcdaef", ["a", "b", "c", "d", "e", "f"]],
    ])("should sort the elements", async function (iterable, result) {
      const res = await sort(sortFn, toAsync(iterable as Iterable<any>));
      expect(res).toEqual(result);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        [3, 4, 1, 2, 5, 2],
        toAsync,
        filter((a) => a % 2 !== 0),
        sort(sortFn),
      );
      expect(res).toEqual([1, 3, 5]);
    });
  });
});
