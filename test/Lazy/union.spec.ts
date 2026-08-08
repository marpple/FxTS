import { pipe, toArray, toAsync, union } from "../../src";

describe("union", function () {
  describe("sync", function () {
    it("should return the union without duplicates, iterable1 first", function () {
      expect(toArray(union([1, 2], [2, 3, 4]))).toEqual([1, 2, 3, 4]);
    });

    it("should remove duplicates within each iterable as well", function () {
      expect(toArray(union([1, 1, 2], [2, 2, 3]))).toEqual([1, 2, 3]);
    });

    it("should work lazily with the iterator protocol", function () {
      const iter = union([1], [2]);
      expect(iter.next()).toEqual({ value: 1, done: false });
      expect(iter.next()).toEqual({ value: 2, done: false });
      expect(iter.next()).toEqual({ value: undefined, done: true });
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe([2, 3, 4], union([1, 2]), toArray);
      expect(res).toEqual([1, 2, 3, 4]);
    });
  });

  describe("async", function () {
    it("should work when either iterable is async", async function () {
      expect(await toArray(union(toAsync([1, 2]), [2, 3]))).toEqual([1, 2, 3]);
      expect(await toArray(union([1, 2], toAsync([2, 3])))).toEqual([1, 2, 3]);
      expect(await toArray(union(toAsync([1, 2]), toAsync([2, 3])))).toEqual([
        1, 2, 3,
      ]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(toAsync([2, 3, 4]), union([1, 2]), toArray);
      expect(res).toEqual([1, 2, 3, 4]);
    });
  });
});
