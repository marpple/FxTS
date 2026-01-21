import { filter, map, pipe, sort, toAsync, toSorted } from "../src";

describe("toSorted", function () {
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
      expect(toSorted(sortFn, iterable as Iterable<any>)).toEqual(result);
    });

    it("should handle empty array", function () {
      const result = toSorted(sortFn, []);
      expect(result).toEqual([]);
    });

    it("should handle single element", function () {
      const result = toSorted(sortFn, [42]);
      expect(result).toEqual([42]);
    });

    it("should handle array with identical elements", function () {
      const result = toSorted(sortFn, [5, 5, 5, 5]);
      expect(result).toEqual([5, 5, 5, 5]);
    });

    it("should be immutable - original array should not be changed", function () {
      const original = [3, 4, 1, 2, 5, 2];
      const result = toSorted(sortFn, original);
      expect(original !== result).toBe(true);
      expect(original).toEqual([3, 4, 1, 2, 5, 2]);
    });

    it("should be immutable - original string should not be changed", function () {
      const original = "bcdaef";
      const result = toSorted(sortFn, original);
      expect(original).toBe("bcdaef");
      expect(result).toEqual(["a", "b", "c", "d", "e", "f"]);
    });

    it("should return the same result as sort but without mutating", function () {
      const arr1 = [3, 4, 1, 2, 5, 2];
      const arr2 = [3, 4, 1, 2, 5, 2];
      const sortedResult = sort(sortFn, arr1);
      const toSortedResult = toSorted(sortFn, arr2);

      expect(toSortedResult).toEqual(sortedResult);
      // arr1 was mutated by sort
      expect(arr1).toEqual(sortedResult);
      // arr2 was not mutated by toSorted
      expect(arr2).toEqual([3, 4, 1, 2, 5, 2]);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        [3, 4, 1, 2, 5, 2],
        filter((a) => a % 2 !== 0),
        toSorted(sortFn),
      );
      expect(res).toEqual([1, 3, 5]);
    });

    it("should work with other functions in pipeline", function () {
      const res = pipe(
        [3, 4, 1, 2, 5, 2],
        map((a) => a * 2),
        filter((a) => a > 4),
        toSorted(sortFn),
      );
      expect(res).toEqual([6, 8, 10]);
    });

    it("should preserve immutability in pipeline", function () {
      const original = [3, 4, 1, 2, 5, 2];
      const originalCopy = [...original];
      const res = pipe(original, toSorted(sortFn));
      expect(original).toEqual(originalCopy);
      expect(res).toEqual([1, 2, 2, 3, 4, 5]);
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
      const res = await toSorted(sortFn, toAsync(iterable as Iterable<any>));
      expect(res).toEqual(result);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        [3, 4, 1, 2, 5, 2],
        toAsync,
        filter((a) => a % 2 !== 0),
        toSorted(sortFn),
      );
      expect(res).toEqual([1, 3, 5]);
    });

    it("should work with other functions in async pipeline", async function () {
      const res = await pipe(
        [3, 4, 1, 2, 5, 2],
        toAsync,
        map((a) => a * 2),
        filter((a) => a > 4),
        toSorted(sortFn),
      );
      expect(res).toEqual([6, 8, 10]);
    });
  });
});
