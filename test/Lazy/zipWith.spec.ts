import { toAsync } from "../../src";
import zipWith from "../../src/Lazy/zipWith";

describe("zipWith", function () {
  const iter1 = ["foo", "bar", "ha"];
  const iter2 = [1, 2, 3];
  const then = [{ foo: 1 }, { bar: 2 }, { ha: 3 }];

  describe("sync", function () {
    it("should apply `f` to each same positioned pair", function () {
      const acc = [];
      const iter = zipWith((a, b) => ({ [a]: b }), iter1, iter2);
      for (const a of iter) {
        acc.push(a);
      }
      expect(acc).toEqual(then);
    });
  });

  describe("async", function () {
    it("should apply `f` to each same positioned pair [iterable/AsyncIterable]", async function () {
      const acc = [];
      const iter = zipWith((a, b) => ({ [a]: b }), toAsync(iter1), iter2);
      for await (const a of iter) {
        acc.push(a);
      }

      expect(acc).toEqual(then);
    });

    it("should apply `f` to each same positioned pair [AsyncIterable/iterable]", async function () {
      const acc = [];
      const iter = zipWith((a, b) => ({ [a]: b }), toAsync(iter1), iter2);

      for await (const a of iter) {
        acc.push(a);
      }

      expect(acc).toEqual(then);
    });

    it("should apply `f` to each same positioned pair [AsyncIterable/AsyncIterable]", async function () {
      const acc = [];
      const iter = zipWith(
        (a, b) => ({ [a]: b }),
        toAsync(iter1),
        toAsync(iter2),
      );

      for await (const a of iter) {
        acc.push(a);
      }

      expect(acc).toEqual(then);
    });
  });
});
