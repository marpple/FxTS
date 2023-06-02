import { map, partition, pipe, toAsync } from "../src";
import { AsyncFunctionException } from "../src/_internal/error";

describe("partition", function () {
  describe("sync", function () {
    it("should be splitted of two part by the callback to given 'Iterable'", function () {
      const res = partition((a) => a % 2 === 0, [1, 2, 3, 4, 5, 6]);

      expect(res).toEqual([
        [2, 4, 6],
        [1, 3, 5],
      ]);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        map((a) => a + 1),
        partition((a) => a % 2 === 0),
      );

      expect(res).toEqual([
        [2, 4, 6, 8, 10],
        [3, 5, 7, 9],
      ]);
    });

    it("should throw an error when the callback is asynchronous", function () {
      expect(() =>
        pipe(
          [1, 2, 3, 4, 5, 6, 7, 8, 9],
          map((a) => a + 1),
          partition((a) => Promise.resolve(a % 2 === 0)),
        ),
      ).toThrowError(new AsyncFunctionException());
    });
  });

  describe("async", function () {
    it("should be splitted of two-part by the callback to given 'AsyncIterable'", async function () {
      const res = await partition(
        (a) => a % 2 === 0,
        toAsync([1, 2, 3, 4, 5, 6]),
      );

      expect(res).toEqual([
        [2, 4, 6],
        [1, 3, 5],
      ]);
    });

    it("should work well when the given function is asynchronous", async function () {
      const res = await partition(
        (a) => Promise.resolve(a % 2 === 0),
        toAsync([1, 2, 3, 4, 5, 6]),
      );

      expect(res).toEqual([
        [2, 4, 6],
        [1, 3, 5],
      ]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync([1, 2, 3, 4, 5, 6, 7, 8, 9]),
        map((a) => a + 1),
        partition((a) => a % 2 === 0),
      );

      expect(res).toEqual([
        [2, 4, 6, 8, 10],
        [3, 5, 7, 9],
      ]);
    });
  });
});
