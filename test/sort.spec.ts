import { filter, pipe, sort, toAsync } from "../src/index";

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
    it("should return 'false' if given iterable is an empty array", function () {
      expect(sort(sortFn, [])).toEqual([]);
      expect(sort(sortFn, [3, 4, 1, 2, 5, 2])).toEqual([1, 2, 2, 3, 4, 5]);
      expect(sort(sortFn, "bcdaef")).toEqual(["a", "b", "c", "d", "e", "f"]);
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
    it("should return 'false' if given iterable is an empty array", async function () {
      const sortFn = (a: number | string, b: number | string) => {
        if (a === b) {
          return 0;
        }
        if (a > b) {
          return 1;
        }
        return -1;
      };

      expect(await sort(sortFn, toAsync([]))).toEqual([]);
      expect(await sort(sortFn, toAsync([3, 4, 1, 2, 5, 2]))).toEqual([
        1, 2, 2, 3, 4, 5,
      ]);
      expect(await sort(sortFn, toAsync("bcdaef"))).toEqual([
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
      ]);
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
