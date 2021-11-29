import { dropUntil, toAsync } from "../../src";
import { AsyncFunctionException } from "../../src/_internal/error";

describe("dropUntil", function () {
  describe("sync", function () {
    it("should be dropped elements until the value applied to callback returns truly", function () {
      const arr = [1, 2, 3, 4, 5, 1, 2];
      const acc = [];
      for (const a of dropUntil((a) => a > 3, arr)) {
        acc.push(a);
      }
      expect(acc).toEqual([5, 1, 2]);
    });

    it("should throw an error when the callback is asynchronous", function () {
      const res = () => [...dropUntil(async (a) => a > 5, [1, 2, 3, 4, 5])];
      expect(res).toThrowError(new AsyncFunctionException());
    });
  });

  describe("async", function () {
    it("should be dropped elements until the value applied to callback returns truly", async function () {
      const arr = [1, 2, 3, 4, 5, 1, 2];
      const acc = [];
      for await (const a of dropUntil((a) => a > 3, toAsync(arr))) {
        acc.push(a);
      }
      expect(acc).toEqual([5, 1, 2]);
    });

    it("should be dropped elements until the value applied to async callback returns truly", async function () {
      const arr = [1, 2, 3, 4, 5, 1, 2];
      const acc = [];
      for await (const a of dropUntil(async (a) => a > 3, toAsync(arr))) {
        acc.push(a);
      }
      expect(acc).toEqual([5, 1, 2]);
    });
  });
});
