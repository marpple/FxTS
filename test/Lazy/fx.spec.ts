import { fx, size, toArray, toAsync, uniq } from "../../src";

describe("fx", function () {
  describe("sync", function () {
    it("handle fx iterable (default)", function () {
      const res1 = [...fx([1, 2, 3, 4, 5])];
      expect(res1).toEqual([1, 2, 3, 4, 5]);

      const res2 = [...fx("abc")];
      expect(res2).toEqual(["a", "b", "c"]);
    });

    it("handle fx iterable", function () {
      const res = fx([1, 2, 3, 4, 5])
        .map((a) => a + 10)
        .toArray();
      expect(res).toEqual([11, 12, 13, 14, 15]);
    });

    it("`to` method", function () {
      const arrSize = fx([5, 2, 3, 1, 4, 5, 3])
        .filter((n) => n % 2 === 1)
        .map((n) => n * 10)
        .to((iterable) => new Set(iterable))
        .add(10).size;
      expect(arrSize).toEqual(3);
    });
  });

  describe("async", () => {
    it("handle fx asyncIterable (default)", async function () {
      const res1 = await toArray(fx(toAsync([1, 2, 3, 4, 5])));
      expect(res1).toEqual([1, 2, 3, 4, 5]);

      const res2 = await toArray(fx(toAsync("abc")));
      expect(res2).toEqual(["a", "b", "c"]);
    });

    it("handle fx asyncIterable", async function () {
      const res1 = await fx(toAsync([1, 2, 3, 4, 5]))
        .map(async (a) => a + 10)
        .toArray();
      expect(res1).toEqual([11, 12, 13, 14, 15]);

      const res2 = await fx([1, 2, 3, 4, 5])
        .toAsync()
        .map(async (a) => a + 10)
        .toArray();
      expect(res2).toEqual([11, 12, 13, 14, 15]);
    });

    it("`to` method", async function () {
      const arrSize = await fx([5, 2, 3, 1, 4, 5, 3])
        .toAsync()
        .filter((n) => n % 2 === 1)
        .map((n) => n * 10)
        .to((iterable) => size(uniq(iterable)));

      expect(arrSize).toEqual(3);
    });
  });
});
