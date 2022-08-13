import { sum, pipe, toAsync } from "../src";

describe("sum", function () {
  describe("sync", function () {
    it.each([
      [[1, 2, 3], 6],
      [[], 0],
    ])("should sum all elements %s %s", function (iterable, result) {
      expect(sum(iterable as Iterable<any>)).toEqual(result);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res1 = pipe([1, 2, 3], sum);
      expect(res1).toEqual(6);
      const res2 = pipe([], sum);
      expect(res2).toEqual(0);
    });
  });

  describe("async", function () {
    it.each([
      [[1, 2, 3], 6],
      [[], 0],
    ])("should sum all elements %s %s", async function (iterable, result) {
      expect(await sum(toAsync(iterable as Iterable<any>))).toEqual(result);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res1 = await pipe([1, 2, 3], toAsync, sum);
      expect(res1).toEqual(6);
      const res2 = await pipe([], toAsync, sum);
      expect(res2).toEqual(0);
    });
  });
});
