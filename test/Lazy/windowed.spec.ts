import { pipe, toArray, toAsync, windowed } from "../../src";

describe("windowed", function () {
  describe("sync", function () {
    it("should yield overlapping windows of the given size", function () {
      expect(toArray(windowed(2, [1, 2, 3, 4]))).toEqual([
        [1, 2],
        [2, 3],
        [3, 4],
      ]);
      expect(toArray(windowed(3, [1, 2, 3, 4, 5]))).toEqual([
        [1, 2, 3],
        [2, 3, 4],
        [3, 4, 5],
      ]);
    });

    it("should yield nothing when the iterable is shorter than size", function () {
      expect(toArray(windowed(3, [1, 2]))).toEqual([]);
    });

    it("should yield single-element windows for size 1", function () {
      expect(toArray(windowed(1, [1, 2]))).toEqual([[1], [2]]);
    });

    it("should work lazily with the iterator protocol", function () {
      const iter = windowed(2, [1, 2, 3]);
      expect(iter.next()).toEqual({ value: [1, 2], done: false });
      expect(iter.next()).toEqual({ value: [2, 3], done: false });
      expect(iter.next()).toEqual({ value: undefined, done: true });
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe([1, 2, 3, 4], windowed(2), toArray);
      expect(res).toEqual([
        [1, 2],
        [2, 3],
        [3, 4],
      ]);
    });
  });

  describe("async", function () {
    it("should work with AsyncIterable", async function () {
      const res = await toArray(windowed(2, toAsync([1, 2, 3])));
      expect(res).toEqual([
        [1, 2],
        [2, 3],
      ]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(toAsync([1, 2, 3, 4]), windowed(3), toArray);
      expect(res).toEqual([
        [1, 2, 3],
        [2, 3, 4],
      ]);
    });
  });
});
